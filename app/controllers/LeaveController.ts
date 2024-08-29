import { redirect } from "@remix-run/node";
import { commitFlashSession, getFlashSession } from "~/utils/flash-session";
import Leave from "~/models/Leave";
import { LeaveInterface } from "~/utils/types";
import UserController from "./UserController";

export default class LeaveController {
  private request: Request;
  private path: string;

  constructor(request: Request) {
    const url = new URL(request.url);
    const path = url.pathname + url.search;

    this.request = request;
    this.path = path;
  }

  public async getLeaves({
    page,
    search_term,
    limit = 10,
    status,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
    status: string;
  }): Promise<{ leaves: LeaveInterface[]; totalPages: number } | any> {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    try {
      const skipCount = (page - 1) * limit;

      const searchFilter = {
        ...(search_term && {
          $or: [
            {
              question: {
                $regex: new RegExp(
                  search_term
                    .split(" ")
                    .map((term) => `(?=.*${term})`)
                    .join(""),
                  "i"
                ),
              },
            },
            {
              answer: {
                $regex: new RegExp(
                  search_term
                    .split(" ")
                    .map((term) => `(?=.*${term})`)
                    .join(""),
                  "i"
                ),
              },
            },
          ],
        }),
        ...(status && { status }),
      };

      const leaves = await Leave.find(searchFilter)
        .populate("user")
        .skip(skipCount)
        .limit(limit)
        .sort({
          createdAt: "desc",
        })
        .exec();

      const totalLeavesCount = await Leave.countDocuments(searchFilter).exec();
      const totalPages = Math.ceil(totalLeavesCount / limit);

      return { leaves, totalPages };
    } catch (error) {
      console.log(error);
      session.flash("message", {
        title: "Error!",
        status: "error",
        description: "Error retrieving leaves",
      });

      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  }

  public getMyLeaves = async ({
    page,
    search_term,
    limit = 10,
    status,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
    status: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    const skipCount = (page - 1) * limit;
    try {
      const userController = new UserController(this.request);
      const userId = await userController.getUserId();

      const searchFilter = {
        ...(search_term && {
          $or: [
            {
              question: {
                $regex: new RegExp(
                  search_term
                    .split(" ")
                    .map((term) => `(?=.*${term})`)
                    .join(""),
                  "i"
                ),
              },
            },
            {
              answer: {
                $regex: new RegExp(
                  search_term
                    .split(" ")
                    .map((term) => `(?=.*${term})`)
                    .join(""),
                  "i"
                ),
              },
            },
          ],
        }),
        ...(status && { status }),
        user: userId,
      };

      const leaves = await Leave.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .sort({
          createdAt: "desc",
        })
        .exec();

      const totalLeavesCount = await Leave.countDocuments(searchFilter).exec();
      const totalPages = Math.ceil(totalLeavesCount / limit);

      return { leaves, totalPages };
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
   * Retrieve a single Leave
   * @param id string
   * @returns LeaveInterface
   */
  public async getLeave(id: string): Promise<LeaveInterface | null> {
    try {
      const faq = await Leave.findById(id);
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
   * @returns LeaveInterface
   */
  public requestLeave = async ({
    type,
    startDate,
    endDate,
    reason,
  }: {
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    const userController = new UserController(this.request);
    const userId = await userController.getUserId();
    try {
      const faq = await Leave.create({
        type,
        startDate,
        endDate,
        reason,
        user: userId,
      });

      session.flash("message", {
        title: "Leave requested!",
        status: "success",
      });
      return redirect(this.path, {
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
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public async updateLeave({
    id,
    type,
    startDate,
    endDate,
    reason,
  }: {
    id: string;
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
  }) {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const faq = await Leave.findByIdAndUpdate(id, {
        type,
        startDate,
        endDate,
        reason,
      });

      session.flash("message", {
        title: "Leave updated!",
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
  }

  /**
   * Delete Leave
   * @param param0 _id
   * @returns null
   */
  public deleteLeave = async ({ id }: { id: string }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await Leave.findByIdAndDelete(id);

      session.flash("message", {
        title: "Success!",
        status: "success",
        description: "Leave deleted successfully",
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

  public changeStatus = async ({
    id,
    status,
  }: {
    id: string;
    status: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await Leave.findByIdAndUpdate(id, {
        status,
      });

      session.flash("message", {
        title: "Status changes",
        status: "success",
        description: "Error retrieving faqs",
      });

      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
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
  };
}
