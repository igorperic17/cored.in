import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import { SigningClientProvider } from "./contexts/client";
import { FeatureFlagContextProvider } from "./contexts/featureFlag";

function App() {
  const queryClient = new QueryClient();

  return (
    <FeatureFlagContextProvider>
      <QueryClientProvider client={queryClient}>
        <SigningClientProvider>
          <RouterProvider router={router} />
        </SigningClientProvider>
      </QueryClientProvider>
    </FeatureFlagContextProvider>
  );
}

export default App;
