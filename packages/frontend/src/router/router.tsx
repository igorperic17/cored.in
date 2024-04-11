import { Root } from "@/components/Root";
import ErrorPage from "@/modules/error/views/errorPage";
import PrivacyPolicyPage from "@/modules/privacy-policy/views/PrivacyPolicyPage";
import LandingPage from "@/modules/landing/views/Landing.page";
import TestAppPage from "@/modules/test-app/views/TestApp.page";
import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./routes";

export const router = createBrowserRouter([
  {
    path: ROUTES.ROOT.path,
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: ROUTES.ROOT.path,
        element: <LandingPage />
      },
      {
        path: ROUTES.PRIVACY_POLICY.path,
        element: <PrivacyPolicyPage />
      },
      {
        path: "/test",
        element: <TestAppPage />
      }
    ]
  }
]);
