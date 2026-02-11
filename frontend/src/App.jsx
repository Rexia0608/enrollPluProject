import Views from "./view/views";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext";
import { AdminProviderTest } from "./context/AdminContextTest"; // ✅ Correct import

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <AdminProviderTest>
            <Views />
          </AdminProviderTest>
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
