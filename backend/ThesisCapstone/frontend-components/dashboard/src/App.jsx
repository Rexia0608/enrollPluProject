import Dashboard from "./pages/dashboard";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    </>
  );
}

export default App;
