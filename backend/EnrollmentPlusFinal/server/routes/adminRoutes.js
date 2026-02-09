import express from "express";
import authorization from "../middlewares/authorization.js";

import {
  addCourseController,
  getCoursesController,
  deleteCourseController,
} from "../controllers/setCourseController.js";

const router = express.Router();

router.post("/addCourse", authorization, addCourseController);

router.patch("/deleteCourse", authorization, deleteCourseController);

router.get("/getAllCourses", authorization, getCoursesController);

export default router;
