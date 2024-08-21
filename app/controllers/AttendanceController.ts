import { redirect } from "@remix-run/node";
import type { AttendanceInterface } from "../utils/types";
import { commitFlashSession, getFlashSession } from "~/utils/flash-session";
import Attendance from "~/models/Attendance";

export default class AttendanceController {
  private request: Request;
  private path: string;

  constructor(request: Request) {
    const url = new URL(request.url);
    const path = url.pathname + url.search;

    this.request = request;
    this.path = path;
  }

  /**
   * Retrieve all Attendance
   * @param param0 page
   * @param param1 search_term
   * @param param2 limit
   * @returns {attendances: AttendanceInterface, totalPages: number}
   */
  public async getAttendances({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
  }): Promise<
    { attendances: AttendanceInterface[]; totalPages: number } | any
  > {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const skipCount = (page - 1) * limit;

    const searchFilter = search_term
      ? {
          $or: [
            {
              name: {
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
      const attendances = await Attendance.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .sort({
          createdAt: "desc",
        })
        .exec();

      const totalAttendancesCount = await Attendance.countDocuments(
        searchFilter
      ).exec();
      const totalPages = Math.ceil(totalAttendancesCount / limit);

      return { attendances, totalPages };
    } catch (error) {
      console.log(error);
      session.flash("message", {
        title: "Error!",
        status: "error",
        message: "Error retrieving attendances",
      });

      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
      // throw new Error("Error retrieving attendances");
    }
  }

  /**
   * Retrieve a single Attendance
   * @param id string
   * @returns AttendanceInterface
   */
  public async getAttendance({ id }: { id: string }) {
    try {
      const department = await Attendance.findById(id);
      return department;
    } catch (error) {
      console.error("Error retrieving department:", error);
    }
  }

  /**
   * Create a new department
   * @param path string
   * @param name string
   * @param parent string
   * @param description string
   * @returns AttendanceInterface
   */
  public createAttendance = async ({
    name,
    parent,
    description,
  }: {
    name: string;
    parent: string;
    description: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const existingAttendance = await Attendance.findOne({ name });

      if (existingAttendance) {
        return {
          status: "error",
          code: 400,
          message: "Attendance already exists",
          errors: [
            {
              field: "name",
              message:
                "A department with this name already exists. Please choose a different name.",
            },
          ],
        };
      }

      const department = await Attendance.create({
        name,
        parent: parent || null,
        description,
        isParent: parent ? false : true,
      });

      session.flash("message", {
        title: "Attendance created!",
        status: "success",
      });
      return redirect("/admin/attendances", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
      return {
        status: "success",
        code: 200,
        message: "Attendance added successfully",
        data: department,
      };
    } catch (error) {
      console.log(error);
      session.flash("message", {
        title: "Something went wrong!",
        status: "error",
      });
      return redirect("/admin/attendances", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
      return {
        status: "error",
        code: 400,
        message: "Error adding department",
      };
    }
  };

  /**
   * Update department
   * @param param0 _id
   * @param param1 name
   * @param param2 parent
   * @param param3 description
   * @returns null
   */
  public updateAttendance = async ({
    _id,
    name,
    parent,
    description,
    supervisors,
    manager,
  }: {
    _id: string;
    name: string;
    parent: string;
    description: string;
    supervisors: string[];
    manager: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const updated = await Attendance.findByIdAndUpdate(
        _id,
        {
          name,
          parent,
          description,
          supervisors,
          manager: manager || null,
        },
        { new: true }
      );

      session.flash("message", {
        title: "Attendance updated successfully!",
        status: "success",
      });
      return redirect("/admin/attendances", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });

      return {
        status: "success",
        code: 200,
        message: "Attendance updated successfully",
        data: updated,
      };
    } catch (error) {
      session.flash("message", {
        title: "Something went wrong!",
        status: "error",
      });
      return redirect("/admin/attendances", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });

      return {
        status: "error",
        code: 400,
        message: "Error updating department",
      };
    }
  };

  /**
   * Delete Attendance
   * @param param0 _id
   * @returns null
   */
  public deleteAttendance = async ({ _id }: { _id: string }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await Attendance.findByIdAndDelete(_id);

      return {
        status: "success",
        code: 200,
        message: "Attendance deleted successfully",
      };
    } catch (error) {
      console.log(error);

      return {
        status: "error",
        code: 400,
        message: "Error deleting department",
      };
    }
  };
}
