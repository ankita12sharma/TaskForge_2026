import { configureStore } from "@reduxjs/toolkit";

import { userSlice } from "./slices/userSlice";
import { taskSlice } from "./slices/taskSlice";
import { workspaceSlice } from "./slices/workspaceSlice";
import { projectSlice } from "./slices/projectSlice";
import { subtaskSlice } from "./slices/subtaskSlice";
import { commentSlice } from "./slices/commentsSlice";
const store = configureStore({
  reducer: {
    [userSlice.reducerPath]: userSlice.reducer,
    [taskSlice.reducerPath]: taskSlice.reducer,
    [workspaceSlice.reducerPath]: workspaceSlice.reducer,
    [projectSlice.reducerPath]: projectSlice.reducer,
    [subtaskSlice.reducerPath]: subtaskSlice.reducer,
    [commentSlice.reducerPath]: commentSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userSlice.middleware)
      .concat(taskSlice.middleware)
      .concat(workspaceSlice.middleware)
      .concat(projectSlice.middleware)
      .concat(subtaskSlice.middleware)
      .concat(commentSlice.middleware),
});
export default store;
