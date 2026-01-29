import Views from "./view/views";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Views />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
