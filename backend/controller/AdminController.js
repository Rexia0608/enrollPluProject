// controllers/adminController.js
import {
  maintenanceCheckerModel,
  maintenanceModel,
  maintenanceMessageModel,
} from "../services/maintenanceServices.js";

const getUserList = async (req, res) => {
  try {
    // Dummy data for testing
    const users = [
      {
        id: 1,
        name: "John Smith",
        email: "john.smith@example.com",
        role: "student",
        status: "active",
        joinedDate: "2024-01-15",
        lastLogin: "2024-01-18",
        studentId: "S2024001",
      },
      {
        id: 2,
        name: "Jane Doe",
        email: "jane.doe@example.com",
        role: "faculty",
        status: "active",
        joinedDate: "2023-08-20",
        lastLogin: "2024-01-18",
        facultyId: "F2023001",
      },
      {
        id: 3,
        name: "Robert Johnson",
        email: "robert.j@example.com",
        role: "student",
        status: "inactive",
        joinedDate: "2024-01-10",
        lastLogin: "2024-01-12",
        studentId: "S2024002",
      },
      {
        id: 4,
        name: "Sarah Williams",
        email: "sarah.w@example.com",
        role: "admin",
        status: "active",
        joinedDate: "2023-09-15",
        lastLogin: "2024-01-18",
        adminId: "A2023001",
      },
      {
        id: 5,
        name: "Michael Brown",
        email: "michael.b@example.com",
        role: "student",
        status: "suspended",
        joinedDate: "2024-01-05",
        lastLogin: "2024-01-08",
        studentId: "S2024003",
      },
      {
        id: 6,
        name: "Emily Davis",
        email: "emily.d@example.com",
        role: "faculty",
        status: "active",
        joinedDate: "2023-10-10",
        lastLogin: "2024-01-18",
        facultyId: "F2023002",
      },
      {
        id: 7,
        name: "David Wilson",
        email: "david.w@example.com",
        role: "student",
        status: "pending",
        joinedDate: "2024-01-16",
        lastLogin: "2024-01-16",
        studentId: "S2024004",
      },
      {
        id: 8,
        name: "Lisa Taylor",
        email: "lisa.t@example.com",
        role: "faculty",
        status: "inactive",
        joinedDate: "2023-11-05",
        lastLogin: "2023-12-20",
        facultyId: "F2023003",
      },
    ];

    // Return JSON response
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUserList:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCourseList = async (req, res) => {
  try {
    const initialCourses = [
      {
        id: 1,
        code: "BSCS",
        name: "Bachelor of Science in Computer Science",
        type: "4 years Course",
        tuition_fee: 12333,
        status: "active",
      },
      {
        id: 2,
        code: "CSS",
        name: "Computer System Servicing NC II",
        type: "Short Course",
        tuition_fee: 12333,
        status: "active",
      },
    ];

    res.status(200).json(initialCourses);
  } catch (error) {
    console.error("Error in getUserList:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const overView = async (req, res) => {
  try {
    const systemOverview = [
      {
        title: "Total Students",
        value: "1,248",
        change: 12,
        icon: "Users",
        color: "blue",
      },
      {
        title: "Pending Documents",
        value: "42",
        change: -5,
        icon: "FileText",
        color: "yellow",
      },
      {
        title: "Pending Payments",
        value: "28",
        change: 8,
        icon: "CreditCard",
        color: "red",
      },
      {
        title: "Enrolled Students",
        value: "876",
        change: 15,
        icon: "CheckCircle",
        color: "green",
      },
    ];
    res.status(200).json(systemOverview);
  } catch (error) {
    console.error("Error in overView:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const setMaintenance = async (req, res) => {
  try {
    const { maintenanceMode, message } = req.body;

    // Pass the parameters as an object to the model
    const maintenance = await maintenanceModel({
      isActive: maintenanceMode, // Map maintenanceMode to isActive
      message: message,
    });

    // Return the updated maintenance state
    res.status(200).json(maintenance);
  } catch (error) {
    console.error("Error in setMaintenance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const checkMaintenance = async (req, res) => {
  try {
    const maintenance = await maintenanceCheckerModel();
    res.status(200).json(maintenance);
  } catch (error) {
    console.error("Error in checkMaintenance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getMaintenanceMessege = async (req, res) => {
  try {
    const message = await maintenanceMessageModel();
    res.status(200).json(message);
  } catch (error) {
    console.error("Error in checkMaintenance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getUserList,
  getCourseList,
  overView,
  checkMaintenance,
  setMaintenance,
  getMaintenanceMessege,
};
