import { useFeatureFlagContext } from "@/contexts/featureFlag";
import { PropsWithChildren, useMemo } from "react";

interface RenderIfFeatureFlagEnabledProps {
  featureFlag: string;
  fallback: JSX.Element;
}

const RenderIfFeatureFlagEnabled = ({ children, featureFlag, fallback }: PropsWithChildren<RenderIfFeatureFlagEnabledProps>) => {
  const { isInitialised, isFeatureEnabled } = useFeatureFlagContext()
  const shouldRender = useMemo(() => isInitialised && isFeatureEnabled(featureFlag), [isInitialised, isFeatureEnabled])
  return shouldRender ? children : fallback
}

export default RenderIfFeatureFlagEnabled