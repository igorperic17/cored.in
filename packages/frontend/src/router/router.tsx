import { Root } from "@/modules/landing/views/Root";
import ResourceNotFoundPage from "@/modules/error/views/resourceNotFoundPage";
import PrivacyPolicyPage from "@/modules/privacy-policy/views/PrivacyPolicyPage";
import LandingPage from "@/modules/landing/views/Landing.page";
import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./routes";
import FeatureFlagProtectedPage from "./featureFlagProtectedPage";
import { FEATURE_FLAG } from "@coredin/shared";
import { HomeRoot } from "@/modules/home/views/HomeRoot";
import HomePage from "@/modules/home/views/Home.page";
import { LoginRoot } from "@/modules/login/views/LoginRoot";
import LoginPage from "@/modules/login/views/Login.Page";

export const router = createBrowserRouter([
  {
    path: ROUTES.ROOT.path,
    element: <Root />,
    errorElement: <ResourceNotFoundPage />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: ROUTES.PRIVACY_POLICY.path,
        element: (
          <FeatureFlagProtectedPage featureFlag={FEATURE_FLAG.PRIVACY_POLICY}>
            <PrivacyPolicyPage />
          </FeatureFlagProtectedPage>
        )
      }
    ]
  },
  {
    path: ROUTES.LOGIN.path,
    element: <LoginRoot />,
    errorElement: <ResourceNotFoundPage />,
    children: [
      {
        index: true,
        element: <LoginPage />
      }
    ]
  },
  {
    path: ROUTES.HOME.path,
    element: (
      // <FeatureFlagProtectedPage featureFlag={FEATURE_FLAG.HOME}>
      <HomeRoot />
      // </FeatureFlagProtectedPage>
    ),
    errorElement: <ResourceNotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      }
    ]
  }
]);
