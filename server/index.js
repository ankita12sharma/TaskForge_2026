const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const UserRouter = require("./Routes/userRoute");
const WorkSpaceRouter = require("./Routes/workspaceRoute");
const ProjectRouter = require("./Routes/projectRoute");
const TaskRouter = require("./Routes/taskRoute");
const SubTaskRouter = require("./Routes/subTaskRoute");
const commentsRouter = require("./Routes/commentRoute");

require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB successfully!!"))
  .catch((err) => console.log(`Error in connecting to MongoDB!!`));

const PORT = process.env.PORT || 8666;
app.use(bodyParser.json());
app.use(cors());

app.use("/", UserRouter);
app.use("/", WorkSpaceRouter);
app.use("/", ProjectRouter);
app.use("/", TaskRouter);
app.use("/", SubTaskRouter);
app.use("/", commentsRouter);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening to server on port ${PORT}`);
});
