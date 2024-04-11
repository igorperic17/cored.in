import { Login } from "@/components";
import { AuthTest } from "../components";

const TestAppPage = () => {
  return (
    <main
      style={{
        minHeight: "60vh",
        flex: "1",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Login />
      <AuthTest />
    </main>
  );
};

export default TestAppPage;
