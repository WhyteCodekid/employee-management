import {
  json,
  createCookieSessionStorage,
  redirect,
  type SessionStorage,
} from "@remix-run/node";
import bcrypt from "bcryptjs";
import User from "~/models/User";
import { commitFlashSession, getFlashSession } from "~/utils/flash-session";
// import generateOTP from "~/utils/generateOTP";
// import sendSMS from "~/utils/sendSMS";

export default class UserController {
  private request: Request;
  private storage: SessionStorage;

  /**
   * Initialize a UserController instance
   * @param request This Fetch API interface represents a resource request.
   * @returns this
   */
  constructor(request: Request) {
    this.request = request;

    const secret = process.env.SESSION_SECRET;
    if (!secret) {
      throw new Error("No session secret provided");
    }
    this.storage = createCookieSessionStorage({
      cookie: {
        name: "__user_auth",
        secrets: [secret],
        sameSite: "lax",
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      },
    });
  }

  private async createUserSession(userId: string, redirectTo: string) {
    const session = await this.storage.getSession();
    session.set("userId", userId);
    // store roles and permissions in session and add a method
    // to check if the user has permission to perform an action

    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await this.storage.commitSession(session),
      },
    });
  }

  private async getUserSession() {
    return this.storage.getSession(this.request.headers.get("Cookie"));
  }

  public async getUserId(
    redirectTo: string = new URL(this.request.url).pathname
  ) {
    const session = await this.getUserSession();
    const userId = session.get("userId");
    if (!userId || typeof userId !== "string") {
      // const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
      // throw redirect(`/login`);
      return null;
    }

    return userId;
  }

  public async checkUser() {
    const userId = await this.getUserId();
    if (!userId) {
      return null;
    }

    return await User.findById(userId).select("-password");
  }

  public async getUser() {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const userId = await this.getUserId();
    // const session = await this.getUserSession();
    // const userId = session.get("userId");

    if (!userId) {
      session.flash("message", {
        title: "Unauthorized",
        status: "error",
        description: "You need to login to access this page",
      });
      throw redirect(`/login`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
      // throw redirect(`/login`);
    }

    try {
      const user = await User.findById(userId).select("-password");

      if (!user) {
        return {
          status: "error",
          code: 400,
          message: "No Account!",
        };
      }

      return user;
    } catch {
      throw this.logout();
    }
  }

  public async checkUserRole(requiredRole = "") {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const userId = await this.getUserId();
    if (!userId) {
      return null;
    }

    const user = await User.findById(userId).select("-password");

    if (user?.role !== requiredRole) {
      session.flash("message", {
        title: "Access Denied!",
        status: "error",
        description: "You do not have access to this page",
      });
      throw redirect(`/${user?.role}`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
    return user;
  }

  public async getUserById(id: string) {
    try {
      const user = await User.findById(id).select("-password");

      if (!user) {
        return {
          status: "error",
          code: 400,
          message: "No ",
        };
      }

      return user;
    } catch {
      return {
        status: "error",
        code: 400,
        message: "Error fetching user",
      };
    }
  }

  public async loginUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const user = await User.findOne({ email });

    if (!user) {
      session.flash("message", {
        title: "Error!",
        description: "No Account with email!",
        status: "error",
      });
      return redirect(`/login`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      session.flash("message", {
        title: "Invalid Credentials",
        status: "error",
      });
      return redirect(`/login`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    return this.createUserSession(user.id, "/user");
  }

  public updateProfile = async ({
    firstName,
    lastName,
    email,
  }: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    const userId = await this.getUserId();
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          firstName,
          lastName,
          email,
        },
        {
          new: true,
        }
      );
      session.flash("message", {
        title: "Profile Updated",
        status: "success",
      });
      return redirect(`/user/profile`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      session.flash("message", {
        title: "Error Updating Profile!",
        status: "error",
      });
      return redirect(`/user/profile`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  /**
   * Change user password
   * @param currentPassword
   * @param password
   * @returns redirect
   * @throws Error
   *
   * @example
   * ```typescript
   * await changePassword({
   *  currentPassword: "password",
   * password: "newpassword"
   * });
   * ```
   * */
  public changePassword = async ({
    currentPassword,
    password,
  }: {
    currentPassword: string;
    password: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    const userId = await this.getUserId();
    const user = await User.findById(userId);

    if (user) {
      const valid = await bcrypt.compare(currentPassword, user.password);

      if (!valid) {
        session.flash("message", {
          title: "Incorrect Password!",
          status: "error",
        });
        return redirect(`/user/profile`, {
          headers: {
            "Set-Cookie": await commitFlashSession(session),
          },
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await User.findByIdAndUpdate(user._id, {
        password: hashedPassword,
      });
      session.flash("message", {
        title: "Password Changed",
        status: "success",
      });
      return redirect(`/user/profile`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } else {
      session.flash("message", {
        title: "User does not exist!",
        status: "error",
      });
      return redirect(`/user/profile`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public async logout() {
    const session = await this.getUserSession();

    return redirect("/login", {
      headers: {
        "Set-Cookie": await this.storage.destroySession(session),
      },
    });
  }

  public createUser = async ({
    firstName,
    lastName,
    email,
    role,
    department,
    phone,
    dateOfBirth,
    permissions,
    position,
    image,
    baseSalary,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    department: string;
    phone: string;
    dateOfBirth: string;
    permissions: string[];
    position: string;
    image: string;
    baseSalary: number;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const phoneExist = await User.findOne({ phone });
      const emailExist = await User.findOne({ email });

      const errors = [];

      if (phoneExist) {
        errors.push({
          field: "phone",
          message: "Phone number already in use",
        });
      }

      if (emailExist) {
        errors.push({
          field: "email",
          message: "Email already in use",
        });
      }

      if (errors.length > 0) {
        console.log({ errors });

        return {
          status: "error",
          code: 400,
          message:
            "User with phone number or staff ID or email already exists.",
          errors,
        };
      }

      const user = await User.create({
        firstName,
        lastName,
        email,
        role,
        department,
        phone,
        staffId: await this.generateStaffId(),
        dateOfBirth,
        permissions,
        position,
        image,
        baseSalary,
      });

      session.flash("message", {
        title: "User created successfuly!",
        status: "success",
      });
      return redirect("/admin/users", {
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
      return redirect("/admin/users", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public getUsers = async ({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term: string;
    limit?: number;
  }) => {
    const skipCount = (page - 1) * limit; // Calculate the number of documents to skip
    const regex = new RegExp(
      search_term
        .split(" ")
        .map((term) => `(?=.*${term})`)
        .join(""),
      "i"
    );

    const searchFilter = search_term
      ? {
          $or: [
            { firstName: regex },
            { lastName: regex },
            { email: regex },
            { phone: regex },
            { staffId: regex },
          ],
        }
      : {};

    const totalEmployeeCount = await User.countDocuments({}).exec();
    const totalPages = Math.ceil(totalEmployeeCount / limit);

    try {
      const users = await User.find(searchFilter)
        .populate("department")
        .skip(skipCount)
        .limit(limit)
        .sort({
          createdAt: "desc",
        })
        .exec();

      return { users, totalPages };
    } catch (error) {
      console.error("Error retrieving users:", error);
    }
  };

  public getUsersByDepartment = async ({
    page,
    search_term,
    limit = 10,
    department,
    role,
  }: {
    page: number;
    search_term: string;
    limit?: number;
    department?: string;
    role?: string;
  }) => {
    const skipCount = (page - 1) * limit; // Calculate the number of documents to skip
    const userController = new UserController(this.request);
    const user = await userController.getUser();

    // Construct the base filter
    const baseFilter: any = {
      _id: { $ne: user._id }, // Exclude the current user
    };
    if (role != "nurse") {
      if (department) baseFilter.department = department;
      if (role) baseFilter.role = role;
    }

    const regex = new RegExp(
      search_term
        .split(" ")
        .map((term) => `(?=.*${term})`)
        .join(""),
      "i"
    );

    // Construct the search filter
    const searchFilter = search_term
      ? {
          $and: [
            baseFilter,
            {
              $or: [
                { firstName: regex },
                { lastName: regex },
                { email: regex },
                { phone: regex },
                { staffId: regex },
              ],
            },
          ],
        }
      : baseFilter;

    try {
      // Apply the search filter when counting the total number of documents
      const totalEmployeeCount = await User.countDocuments(searchFilter).exec();
      const totalPages = Math.ceil(totalEmployeeCount / limit);

      const users = await User.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .sort({
          createdAt: "desc",
        })
        .exec();

      return { users, totalPages };
    } catch (error) {
      console.error("Error retrieving users:", error);
      throw error;
    }
  };

  public deleteUser = async ({ userId }: { userId: string }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await User.findByIdAndDelete(userId);
      session.flash("message", {
        title: "User Deleted",
        status: "success",
      });
      return redirect("/admin/users", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      session.flash("message", {
        title: "Error Deleting User!",
        status: "error",
      });
      return redirect("/admin/users", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public updateUserProfile = async ({
    userId,
    firstName,
    lastName,
    email,
    role,
    department,
    phone,
    staffId,
    dateOfBirth,
    permissions,
    position,
    baseSalary,
  }: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    department: string;
    phone: string;
    staffId: string;
    dateOfBirth: string;
    permissions: string[];
    position: string;
    baseSalary: number;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const errors = [];

      // Check for unique phone number
      if (phone) {
        const phoneExist = await User.findOne({
          phone: phone,
          _id: { $ne: userId },
        });
        if (phoneExist) {
          errors.push({
            field: "phone",
            message: "Phone number already in use",
          });
        }
      }

      // Check for unique staff ID
      if (staffId) {
        const staffIdExist = await User.findOne({
          staffId: staffId,
          _id: { $ne: userId },
        });
        if (staffIdExist) {
          errors.push({
            field: "staffId",
            message: "Staff ID already in use",
          });
        }
      }

      // Check for unique email
      if (email) {
        const emailExist = await User.findOne({
          email: email,
          _id: { $ne: userId },
        });
        if (emailExist) {
          errors.push({
            field: "email",
            message: "Email already in use",
          });
        }
      }

      // If there are validation errors, return them
      if (errors.length > 0) {
        return {
          status: "error",
          code: 400,
          message:
            "User with phone number or staff ID or email already exists.",
          errors,
        };
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        {
          firstName,
          lastName,
          email,
          role,
          department,
          phone,
          staffId,
          dateOfBirth,
          permissions,
          position,
          baseSalary,
        },
        {
          new: true, // Return the updated document
          runValidators: true, // Run schema validators
        }
      );

      if (!updatedUser) {
        throw new Error("User not found");
      }

      session.flash("message", {
        title: "User updated successfuly!",
        status: "success",
      });
      return redirect("/admin/users", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      console.log(error);

      session.flash("message", {
        title: "Something unexpected occured!",
        status: "success",
      });
      return redirect("/admin/users", {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public resetPassword = async ({
    userId,
    path,
    password,
  }: {
    userId: string;
    path: string;
    password: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.findByIdAndUpdate(userId, {
        password: hashedPassword,
      });
      session.flash("message", {
        title: "Password Reset",
        status: "success",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      session.flash("message", {
        title: "Error Resetting Password!",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  private generateStaffId = async () => {
    const staffId = Math.floor(100000 + Math.random() * 900000);
    return staffId.toString();
  };
}
