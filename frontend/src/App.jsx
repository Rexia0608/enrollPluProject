// App.js
import Views from "./view/views";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext";
import { MaintenanceProvider } from "./context/MaintenanceContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MaintenanceProvider>
          <AdminProvider>
            <Views />
          </AdminProvider>
        </MaintenanceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
