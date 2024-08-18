import mongoose from "mongoose";

// Connect to your MongoDB instance
// mongodb://127.0.0.1:27017/linakess_pos
// mongoose.connect(process.env.MONGODB_URI as string);
mongoose.connect("mongodb://127.0.0.1:27017/employee-management");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Database connection error:"));
db.once("open", () => {
  console.log("Connected to Database, App is ready for use.");
});

export default mongoose;
