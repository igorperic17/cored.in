import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import axios from "axios";

interface FeatureFlagContext {
  isInitialised: boolean;
  isFeatureEnabled: (name: string) => boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContext>({
  isInitialised: false,
  isFeatureEnabled: () => false
});

export const useFeatureFlagContext = () => useContext(FeatureFlagContext);

export const FeatureFlagContextProvider = ({
  children
}: PropsWithChildren<unknown>) => {
  const [features, setFeatures] = useState<Record<string, string> | null>(null);
  const [isInitialised, setIsInitialised] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Record<string, string>>(
          "https://bse2cpgtw8.execute-api.eu-west-1.amazonaws.com/dev/features"
        );
        setFeatures(response.data);
        setIsInitialised(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    console.log("Calling fetchData");
    fetchData();
  }, []);

  const isFeatureEnabled = useCallback(
    (name: string) => {
      if (!isInitialised || !features) {
        throw new Error("Feature flag context is not initialised!");
      }
      return !!features[name];
    },
    [isInitialised, features]
  );

  return (
    <FeatureFlagContext.Provider value={{ isInitialised, isFeatureEnabled }}>
      {children}
    </FeatureFlagContext.Provider>
  );
};
