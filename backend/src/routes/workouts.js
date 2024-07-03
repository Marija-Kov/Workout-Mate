const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workoutController");
const requireAuth = require("../middleware/requireAuth");
const { tryCatch } = require("../error/tryCatch");

router.use(requireAuth);

router.get("/", tryCatch(workoutController.get_all_user_workouts));
router.post("/", tryCatch(workoutController.add_workout));
router.patch("/:id", tryCatch(workoutController.update_workout));
router.delete("/:id", tryCatch(workoutController.delete_workout));
router.delete("/", tryCatch(workoutController.delete_all_user_workouts));

module.exports = router;
