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
   * @returns {faqs: DeductionBonusInterface, totalPages: number}
   */
  public async getDeductionBonuses({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
  }): Promise<{ faqs: DeductionBonusInterface[]; totalPages: number } | any> {
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

      const [faqs, totalDeductionBonusesCount] = await Promise.all([
        DeductionBonus.find(searchFilter)
          .skip(skipCount)
          .limit(limit)
          .sort({
            createdAt: "desc",
          })
          .exec(),
        DeductionBonus.countDocuments(searchFilter).exec(),
      ]);

      const totalPages = Math.ceil(totalDeductionBonusesCount / limit);
      return { faqs, totalPages };
    } catch (error) {
      console.log(error);
      session.flash("message", {
        title: "Error!",
        status: "error",
        description: "Error retrieving faqs",
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
      const faq = await DeductionBonus.findById(id);
      return faq;
    } catch (error) {
      console.error("Error retrieving faq:", error);
      return null;
    }
  }

  /**
   * Create a new faq
   * @param question string
   * @param answer string
   * @returns DeductionBonusInterface
   */
  public createDeductionBonus = async ({
    question,
    answer,
  }: {
    question: string;
    answer: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const existingDeductionBonus = await DeductionBonus.findOne({ question });

      if (existingDeductionBonus) {
        return {
          status: "error",
          code: 400,
          message: "DeductionBonus already exists",
          errors: [
            {
              field: "question",
              message:
                "A faq with this question already exists. Please choose a different question.",
            },
          ],
        };
      }

      const faq = await DeductionBonus.create({
        question,
        answer,
      });

      session.flash("message", {
        title: "DeductionBonus created!",
        status: "success",
      });
      return redirect("/admin/faqs", {
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
      return redirect("/admin/faqs", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  /**
   * Update faq
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
      return redirect("/admin/faqs", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      session.flash("message", {
        title: "Something went wrong!",
        status: "error",
      });
      return redirect("/admin/faqs", {
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
      return redirect("/admin/faqs", {
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
      return redirect("/admin/faqs", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };
}
