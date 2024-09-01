import { redirect } from "@remix-run/node";
import type { AttendanceInterface } from "../utils/types";
import { commitFlashSession, getFlashSession } from "~/utils/flash-session";
import Attendance from "~/models/Attendance";
import User from "~/models/User";
import Department from "~/models/Department";
import Faq from "~/models/Faq";
import Leave from "~/models/Leave";
import UserController from "./UserController";

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
        .populate("user")
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

  public async getMyAttendances({
    page,
    month,
    limit = 10,
  }: {
    page: number;
    month?: string;
    limit?: number;
  }): Promise<
    { attendances: AttendanceInterface[]; totalPages: number } | any
  > {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    const skipCount = (page - 1) * limit;

    const userController = new UserController(this.request);
    const userId = await userController.getUserId();

    try {
      const attendances = await Attendance.find({
        user: userId,
      })
        .skip(skipCount)
        .limit(limit)
        .sort({
          createdAt: "desc",
        })
        .exec();

      const totalAttendancesCount = await Attendance.countDocuments({
        user: userId,
      }).exec();
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
    }
  };

  public todayAttendance = async ({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
  }) => {
    const skipCount = (page - 1) * limit;

    const searchFilter = search_term
      ? {
          $or: [
            {
              "user.name": {
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
      const today = new Date();
      const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const end = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      const attendance = await Attendance.find(searchFilter)
        .populate("user")
        .skip(skipCount)
        .limit(limit)
        .sort({
          createdAt: "desc",
        });

      const totalAttendancesCount = await Attendance.countDocuments(
        searchFilter
      ).exec();

      const totalPages = Math.ceil(totalAttendancesCount / limit);

      return { attendance, totalPages };
    } catch (error) {
      console.error("Error retrieving today's attendance:", error);
    }
  };

  // get totals for, users, attendance, departments
  public async getTotals() {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const usersCount = await User.countDocuments().exec();
      const attendanceCount = await Attendance.countDocuments().exec();
      const departmentsCount = await Department.countDocuments().exec();
      const faqCount = await Faq.countDocuments().exec();
      const leaveCount = await Leave.countDocuments().exec();
      const pendingLeaveCount = await Leave.countDocuments({
        status: "pending",
      }).exec();

      return {
        usersCount,
        attendanceCount,
        departmentsCount,
        faqCount,
        leaveCount,
        pendingLeaveCount,
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
    }
  }

  // get totals for current user
  public async getUserTotals() {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    const userId = await new UserController(this.request).getUserId();

    try {
      const attendanceCount = await Attendance.countDocuments({
        user: userId,
      }).exec();
      const leaveCount = await Leave.countDocuments({
        user: userId,
      }).exec();
      const pendingLeaveCount = await Leave.countDocuments({
        user: userId,
        status: "pending",
      }).exec();

      return {
        attendanceCount,
        leaveCount,
        pendingLeaveCount,
      };
    } catch (error) {
      session.flash("message", {
        title: "Something went wrong!",
        status: "error",
      });
      return redirect("/staff", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  }
}
