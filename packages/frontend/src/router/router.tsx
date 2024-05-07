import { Root } from "@/modules/landing/views/Root";
import { AppRoot } from "@/modules/app/views/AppRoot";
import ResourceNotFoundPage from "@/modules/error/views/resourceNotFoundPage";
import PrivacyPolicyPage from "@/modules/privacy-policy/views/PrivacyPolicyPage";
import LandingPage from "@/modules/landing/views/Landing.page";
import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./routes";
import AppPage from "@/modules/app/views/App.page";
import FeatureFlagProtectedPage from "./featureFlagProtectedPage";
import { FEATURE_FLAG } from "@coredin/shared";

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
    path: ROUTES.APP.path,
    element: (
      <FeatureFlagProtectedPage featureFlag={FEATURE_FLAG.APP}>
        <AppRoot />
      </FeatureFlagProtectedPage>
    ),
    errorElement: <ResourceNotFoundPage />,
    children: [
      {
        index: true,
        element: <AppPage />
      }
    ]
  }
]);
