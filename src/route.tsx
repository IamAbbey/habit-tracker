import App from "./App.tsx";
import "./index.css";

import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./components/error-page.tsx";
import BoardPage, { getTasks } from "./components/board/page.tsx";

export enum PageRoutes {
  HOME = "/",
}

export const router = createBrowserRouter([
  {
    path: PageRoutes.HOME,
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        path: PageRoutes.HOME,
        element: <BoardPage />,
        loader: async () => {
          return { tasks: await getTasks() };
        },
      },
    ],
  },
]);
