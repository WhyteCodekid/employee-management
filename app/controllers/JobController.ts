import { redirect } from "@remix-run/node";
import type { JobInterface } from "../utils/types";
import { commitFlashSession, getFlashSession } from "~/utils/flash-session";
import Job from "~/models/Job";
import Application from "~/models/Application";

export default class JobController {
  private request: Request;
  private path: string;

  constructor(request: Request) {
    const url = new URL(request.url);
    const path = url.pathname + url.search;

    this.request = request;
    this.path = path;
  }

  public async getJobs({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
  }): Promise<{ jobs: JobInterface[]; totalPages: number } | any> {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const skipCount = (page - 1) * limit;

    const searchFilter = search_term
      ? {
          $or: [
            {
              title: {
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
              description: {
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

    try {
      const jobs = await Job.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .sort({
          createdAt: "desc",
        })
        .exec();

      const totalJobsCount = await Job.countDocuments(searchFilter).exec();
      const totalPages = Math.ceil(totalJobsCount / limit);

      return { jobs, totalPages };
    } catch (error) {
      console.log(error);
      session.flash("message", {
        title: "Error!",
        status: "error",
        description: "Error retrieving jobs",
      });

      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  }

  public async getJob({ id }: { id: string }) {
    try {
      const job = await Job.findById(id);
      return job;
    } catch (error) {
      console.error("Error retrieving job:", error);
    }
  }

  public createJob = async ({
    title,
    description,
    commitment,
    salary,
  }: {
    title: string;
    description: string;
    commitment?: string;
    salary: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const existingJob = await Job.findOne({ title });

      if (existingJob) {
        return {
          status: "error",
          code: 400,
          message: "Job already exists",
          errors: [
            {
              field: "name",
              message:
                "A job with this name already exists. Please choose a different name.",
            },
          ],
        };
      }

      const job = await Job.create({
        title,
        description,
        commitment,
        salary,
      });

      session.flash("message", {
        title: "Job created!",
        status: "success",
      });
      return redirect("/admin/jobs", {
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
      return redirect("/admin/jobs", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public updateJob = async ({
    id,
    title,
    description,
    commitment,
    salary,
  }: {
    id: string;
    title: string;
    description: string;
    commitment?: string;
    salary: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const updated = await Job.findByIdAndUpdate(
        id,
        {
          title,
          description,
          commitment,
          salary,
        },
        { new: true }
      );

      session.flash("message", {
        title: "Job updated successfully!",
        status: "success",
      });
      return redirect("/admin/jobs", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      session.flash("message", {
        title: "Something went wrong!",
        status: "error",
      });
      return redirect("/admin/jobs", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public deleteJob = async (id: string) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await Job.findByIdAndDelete(id);

      session.flash("message", {
        title: "Job deleted successfully!",
        status: "success",
      });
      return redirect("/admin/jobs", {
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
      return redirect("/admin/jobs", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public applyJob = async ({
    jobId,
    fullName,
    email,
    commitment,
    gender,
  }: {
    jobId: string;
    fullName: string;
    email: string;
    commitment: string;
    gender: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const job = await Application.create({
        fullName,
        email,
        commitment,
        gender,
        job: jobId,
      });

      session.flash("message", {
        title: "Job applied successfully!",
        status: "success",
      });
      return redirect("/public", {
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
      return redirect("/public", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public getApplications = async () => {
    try {
      const applications = await Application.find().populate("job").exec();
      return { applications };
    } catch (error) {
      console.error("Error retrieving applications:", error);
    }
  };
}
