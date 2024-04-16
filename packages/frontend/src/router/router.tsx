import { Root } from "@/components/Root";
import { AppRoot } from "@/components/AppRoot";
import ErrorPage from "@/modules/error/views/errorPage";
import PrivacyPolicyPage from "@/modules/privacy-policy/views/PrivacyPolicyPage";
import LandingPage from "@/modules/landing/views/Landing.page";
import TestAppPage from "@/modules/test-app/views/TestApp.page";
import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./routes";
import AppPage from "@/modules/app/views/App.page";

export const router = createBrowserRouter([
  {
    path: ROUTES.ROOT.path,
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: ROUTES.PRIVACY_POLICY.path,
        element: <PrivacyPolicyPage />
      },
      {
        path: "test",
        element: <TestAppPage />
      }
    ]
  },
  {
    path: ROUTES.APP.path,
    element: <AppRoot />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <AppPage />
      }
    ]
  }
]);
