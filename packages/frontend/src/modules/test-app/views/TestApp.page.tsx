import { Login } from "@/components";

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
    </main>
  );
};

export default TestAppPage;
