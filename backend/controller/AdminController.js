// controllers/adminController.js
import {
  maintenanceCheckerModel,
  maintenanceModel,
  maintenanceMessageModel,
} from "../services/maintenanceServices.js";

import { getAllUsersList, getAllCoursesList } from "../models/AdminModel.js";

const getAllUsers = async (req, res) => {
  try {
    const result = await getAllUsersList();
    // Return JSON response
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getUserList:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCourses = async (req, res) => {
  try {
    const result = await getAllCoursesList();
    console.log(result);
    res.status(200).json(result);
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

    const maintenance = await maintenanceModel({
      isActive: maintenanceMode,
      message: message,
    });

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
  getCourses,
  overView,
  checkMaintenance,
  setMaintenance,
  getMaintenanceMessege,
};
