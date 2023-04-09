const express = require("express");

const {
  getAccountDetails,
  submitTask,
  submitTodo,
  updateTodo,
  deleteTodo,
  deleteTask,
  markTaskDone,
} = require("../controllers/plannerController");

const router = express.Router();

router.get("/:id", getAccountDetails);
router.post("/", submitTask);
router.post("/todo", submitTodo);
router.put("/todo/:id", updateTodo);
router.post("/todo/:id", deleteTodo);
router.post("/task/:id", deleteTask);
router.post("/task-done/:id", markTaskDone);

module.exports = router;
