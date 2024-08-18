import { redirect } from "@remix-run/node";
import type { DepartmentInterface } from "../utils/types";
import { commitFlashSession, getFlashSession } from "~/flash-session";
import Department from "~/models/Department";

export default class DepartmentController {
  private request: Request;
  private path: string;

  constructor(request: Request) {
    const url = new URL(request.url);
    const path = url.pathname + url.search;

    this.request = request;
    this.path = path;
  }

  /**
   * Retrieve all Department
   * @param param0 page
   * @param param1 search_term
   * @param param2 limit
   * @returns {departments: DepartmentInterface, totalPages: number}
   */
  public async getDepartments({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
  }): Promise<
    { departments: DepartmentInterface[]; totalPages: number } | any
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
      const departments = await Department.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .populate("parent")
        .populate("manager")
        .populate("supervisors")
        .sort({
          createdAt: "desc",
        })
        .exec();

      const totalDepartmentsCount = await Department.countDocuments(
        searchFilter
      ).exec();
      const totalPages = Math.ceil(totalDepartmentsCount / limit);

      return { departments, totalPages };
    } catch (error) {
      console.log(error);
      session.flash("alert", {
        title: "Error!",
        status: "error",
        message: "Error retrieving departments",
      });

      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
      // throw new Error("Error retrieving departments");
    }
  }

  /**
   * Retrieve a single Department
   * @param id string
   * @returns DepartmentInterface
   */
  public async getDepartment({ id }: { id: string }) {
    try {
      const department = await Department.findById(id);
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
   * @returns DepartmentInterface
   */
  public createDepartment = async ({
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
      const existingDepartment = await Department.findOne({ name });

      if (existingDepartment) {
        return {
          status: "error",
          code: 400,
          message: "Department already exists",
          errors: [
            {
              field: "name",
              message:
                "A department with this name already exists. Please choose a different name.",
            },
          ],
        };
      }

      const department = await Department.create({
        name,
        parent: parent || null,
        description,
        isParent: parent ? false : true,
      });

      if (!department) {
        return {
          status: "error",
          code: 400,
          message: "Error adding department",
          errors: [
            {
              field: "name",
              message: "Error adding department",
            },
          ],
        };
      }

      return {
        status: "success",
        code: 200,
        message: "Department added successfully",
        data: department,
      };
    } catch (error) {
      console.log(error);

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
  public updateDepartment = async ({
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
      const updated = await Department.findByIdAndUpdate(
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

      return {
        status: "success",
        code: 200,
        message: "Department updated successfully",
        data: updated,
      };
    } catch (error) {
      return {
        status: "error",
        code: 400,
        message: "Error updating department",
      };
    }
  };

  /**
   * Delete Department
   * @param param0 _id
   * @returns null
   */
  public deleteDepartment = async ({ _id }: { _id: string }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await Department.findByIdAndDelete(_id);

      return {
        status: "success",
        code: 200,
        message: "Department deleted successfully",
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
