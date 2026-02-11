import express from "express";
import { getUserList, getCourseList } from "../controller/AdminController.js";

const router = express.Router();

router.get("/usersList", getUserList);
router.get("/courseList", getCourseList);

export default router;
