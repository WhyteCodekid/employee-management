import Leave from "~/models/Leave";
import User from "~/models/User";

export default class DashboardController {
  private request: Request;
  private path: string;

  constructor(request: Request) {
    const url = new URL(request.url);
    const path = url.pathname + url.search;

    this.request = request;
    this.path = path;
  }

  public getDashboardData = async () => {
    const [pendingLeaves, approvedLeaves, rejectedLeaves, totalUsers] =
      await Promise.all([
        Leave.countDocuments({ status: "pending" }),
        Leave.countDocuments({ status: "approved" }),
        Leave.countDocuments({ status: "rejected" }),
        User.countDocuments(),
      ]);

    return { pendingLeaves, approvedLeaves, rejectedLeaves, totalUsers };
  };

  public getAdminDashboardData = async () => {
    const [pendingLeaves, approvedLeaves, rejectedLeaves, totalUsers] =
      await Promise.all([
        Leave.countDocuments({ status: "pending" }),
        Leave.countDocuments({ status: "approved" }),
        Leave.countDocuments({ status: "rejected" }),
        User.countDocuments(),
      ]);

    return { pendingLeaves, approvedLeaves, rejectedLeaves, totalUsers };
  };
}
