import RenderIfFeatureFlagEnabled from "@/components/RenderIfFeatureFlagEnabled";
import ResourceNotFoundPage from "@/modules/error/views/resourceNotFoundPage";
import { PropsWithChildren } from "react";

interface FeatureFlagProtectedPageProps {
  featureFlag: string;
}

const FeatureFlagProtectedPage = ({ children, featureFlag }: PropsWithChildren<FeatureFlagProtectedPageProps>) => {
  return (
    <RenderIfFeatureFlagEnabled featureFlag={featureFlag} fallback={<ResourceNotFoundPage />}>
      {children}
    </RenderIfFeatureFlagEnabled>
  )
}

export default FeatureFlagProtectedPage
