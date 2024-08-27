import { redirect } from "@remix-run/node";
import { commitFlashSession, getFlashSession } from "~/utils/flash-session";
import DeductionBonus from "~/models/DeductionBonus";
import { DeductionBonusInterface } from "~/utils/types";

export default class PayrollController {
  private request: Request;
  private path: string;

  constructor(request: Request) {
    const url = new URL(request.url);
    const path = url.pathname + url.search;

    this.request = request;
    this.path = path;
  }

  /**
   * Retrieve all DeductionBonus
   * @param param0 page
   * @param param1 search_term
   * @param param2 limit
   * @returns {deductionBonus: DeductionBonusInterface, totalPages: number}
   */
  public async getDeductionBonuses({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
  }): Promise<
    { deductionBonus: DeductionBonusInterface[]; totalPages: number } | any
  > {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    try {
      const skipCount = (page - 1) * limit;
      const regex = new RegExp(
        search_term ||
          ""
            .split(" ")
            .map((term) => `(?=.*${term})`)
            .join(""),
        "i"
      );

      const searchFilter = search_term
        ? {
            $or: [
              {
                question: { $regex: regex },
              },
              {
                answer: { $regex: regex },
              },
            ],
          }
        : {};

      const [deductionBonus, totalDeductionBonusesCount] = await Promise.all([
        DeductionBonus.find(searchFilter)
          .skip(skipCount)
          .limit(limit)
          .populate("user")
          .sort({
            createdAt: "desc",
          })
          .exec(),
        DeductionBonus.countDocuments(searchFilter).exec(),
      ]);

      const totalPages = Math.ceil(totalDeductionBonusesCount / limit);
      return { deductionBonus, totalPages };
    } catch (error) {
      console.log(error);
      session.flash("message", {
        title: "Error!",
        status: "error",
        description: "Error retrieving deductionBonus",
      });

      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  }

  /**
   * Retrieve a single DeductionBonus
   * @param id string
   * @returns DeductionBonusInterface
   */
  public async getDeductionBonus(
    id: string
  ): Promise<DeductionBonusInterface | null> {
    try {
      const deductionBonus = await DeductionBonus.findById(id).populate("user");

      return deductionBonus;
    } catch (error) {
      console.error("Error retrieving deductionBonus:", error);
      return null;
    }
  }

  /**
   * Create a new deductionBonus
   * @param question string
   * @param answer string
   * @returns DeductionBonusInterface
   */
  public createDeductionBonus = async ({
    user,
    type,
    amount,
  }: {
    user: string;
    type: string;
    amount: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const deductionBonus = await DeductionBonus.create({
        user,
        type,
        amount,
      });

      session.flash("message", {
        title: "Record created!",
        status: "success",
      });
      return redirect("/admin/payroll", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      console.log(error);
      session.flash("message", {
        title: "Something went wrong!",
        status: "error",
      });
      return redirect("/admin/payroll", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  /**
   * Update deductionBonus
   * @param param0 _id
   * @param param1 name
   * @param param2 parent
   * @param param3 description
   * @returns null
   */
  public updateDeductionBonus = async ({
    id,
    question,
    answer,
  }: {
    id: string;
    question: string;
    answer: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const updated = await DeductionBonus.findByIdAndUpdate(
        id,
        {
          question,
          answer,
        },
        { new: true }
      );

      session.flash("message", {
        title: "DeductionBonus updated successfully!",
        status: "success",
      });
      return redirect("/admin/payroll", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      session.flash("message", {
        title: "Something went wrong!",
        status: "error",
      });
      return redirect("/admin/payroll", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  /**
   * Delete DeductionBonus
   * @param param0 _id
   * @returns null
   */
  public deleteDeductionBonus = async ({ id }: { id: string }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await DeductionBonus.findByIdAndDelete(id);

      session.flash("message", {
        title: "Success!",
        status: "success",
        description: "DeductionBonus deleted successfully",
      });
      return redirect("/admin/payroll", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      console.log(error);

      session.flash("message", {
        title: "Something went wrong!",
        status: "error",
      });
      return redirect("/admin/payroll", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };
}
