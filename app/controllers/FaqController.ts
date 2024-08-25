import { redirect } from "@remix-run/node";
import { commitFlashSession, getFlashSession } from "~/utils/flash-session";
import Faq from "~/models/Faq";
import { FaqInterface } from "~/utils/types";

export default class FaqController {
  private request: Request;
  private path: string;

  constructor(request: Request) {
    const url = new URL(request.url);
    const path = url.pathname + url.search;

    this.request = request;
    this.path = path;
  }

  /**
   * Retrieve all Faq
   * @param param0 page
   * @param param1 search_term
   * @param param2 limit
   * @returns {faqs: FaqInterface, totalPages: number}
   */
  public async getFaqs({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
  }): Promise<{ faqs: FaqInterface[]; totalPages: number } | any> {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    try {
      const skipCount = (page - 1) * limit;

      const searchFilter = search_term
        ? {
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
          }
        : {};

      const faqs = await Faq.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .sort({
          createdAt: "desc",
        })
        .exec();

      const totalFaqsCount = await Faq.countDocuments(searchFilter).exec();
      const totalPages = Math.ceil(totalFaqsCount / limit);

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
   * Retrieve a single Faq
   * @param id string
   * @returns FaqInterface
   */
  public async getFaq(id: string): Promise<FaqInterface | null> {
    try {
      const faq = await Faq.findById(id);
      return faq;
    } catch (error) {
      console.error("Error retrieving faq:", error);
    }
  }

  /**
   * Create a new faq
   * @param question string
   * @param answer string
   * @returns FaqInterface
   */
  public createFaq = async ({
    question,
    answer,
  }: {
    question: string;
    answer: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const existingFaq = await Faq.findOne({ name });

      if (existingFaq) {
        return {
          status: "error",
          code: 400,
          message: "Faq already exists",
          errors: [
            {
              field: "name",
              message:
                "A faq with this name already exists. Please choose a different name.",
            },
          ],
        };
      }

      const faq = await Faq.create({
        question,
        answer,
      });

      session.flash("message", {
        title: "Faq created!",
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
  public updateFaq = async ({
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
      const updated = await Faq.findByIdAndUpdate(
        id,
        {
          question,
          answer,
        },
        { new: true }
      );

      session.flash("message", {
        title: "Faq updated successfully!",
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
   * Delete Faq
   * @param param0 _id
   * @returns null
   */
  public deleteFaq = async ({ id }: { id: string }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await Faq.findByIdAndDelete(id);

      session.flash("message", {
        title: "Success!",
        status: "success",
        description: "Faq deleted successfully",
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
