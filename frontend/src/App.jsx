// App.js
import Views from "./view/views";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext";
import { StudentProvider } from "./context/StudentContext";
import { MaintenanceProvider } from "./context/MaintenanceContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MaintenanceProvider>
          <AdminProvider>
            <StudentProvider>
              <Views />
            </StudentProvider>
          </AdminProvider>
        </MaintenanceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
