import Views from "./view/views";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AdminProviderTest } from "./context/AdminContextTest"; // ✅ Correct import

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminProviderTest>
          <Views />
        </AdminProviderTest>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
