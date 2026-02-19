// controllers/adminController.js
import {
  maintenanceCheckerModel,
  maintenanceModel,
  maintenanceMessageModel,
} from "../services/maintenanceServices.js";
import { getAllUsersList } from "../models/AdminModel.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersList();

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
        started_date: "2023-09-01",
        end_date: "2027-06-30",
        status: "active",
      },
      {
        id: 2,
        code: "CSS",
        name: "Computer System Servicing NC II",
        type: "Short Course",
        started_date: "2024-01-15",
        end_date: "2024-06-15",
        status: "active",
      },
      {
        id: 3,
        code: "BSIT",
        name: "Bachelor of Science in Information Technology",
        type: "4 years Course",
        started_date: "2023-09-01",
        end_date: "2027-06-30",
        status: "inactive",
      },
      {
        id: 4,
        code: "HUMSS",
        name: "Humanities and Social Sciences",
        type: "2 years Course",
        started_date: "2024-01-20",
        end_date: "2026-01-20",
        status: "active",
      },
      {
        id: 5,
        code: "STEM",
        name: "Science, Technology, Engineering and Mathematics",
        type: "2 years Course",
        started_date: "2024-02-01",
        end_date: "2026-02-01",
        status: "inactive",
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
  getAllUsers,
  getCourseList,
  overView,
  checkMaintenance,
  setMaintenance,
  getMaintenanceMessege,
};
