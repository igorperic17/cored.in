import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import { SigningClientProvider } from "./contexts/client";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SigningClientProvider>
        <RouterProvider router={router} />
      </SigningClientProvider>
    </QueryClientProvider>
  );
}

export default App;
