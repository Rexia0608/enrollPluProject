// controllers/adminController.js
import {
  maintenanceCheckerModel,
  maintenanceModel,
  maintenanceMessageModel,
} from "../services/maintenanceServices.js";
<<<<<<< HEAD
import { getAllUsersList } from "../models/AdminModel.js";
=======
>>>>>>> 5c8dcd30dd49ebb5e6fa159bd13d4ea17ad7129c

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
  getAllUsers,
  getCourseList,
  overView,
  checkMaintenance,
  setMaintenance,
  getMaintenanceMessege,
};
