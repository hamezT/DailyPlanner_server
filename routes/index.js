const express = require('express');
const router = express.Router();


//Import Controller
const authenticateToken = require('../middleware/authenticateToken'); 
const userController = require('../controllers/userController');
const taskController = require('../controllers/taskController');
// Routes

//  User routes
router.post('/auth/register', userController.register);
router.post('/auth/login', userController.login);
// Task routes
router.get('/tasks' , authenticateToken, taskController.getTasks);
router.post('/tasks/create' , authenticateToken, taskController.addTask);
router.put('/tasks/edit/:id' ,authenticateToken,  taskController.updateTask);
router.delete('/tasks/delete/:id' ,authenticateToken,  taskController.deleteTask);
router.get('/tasks/:id', authenticateToken, taskController.getTaskDetails);
router.get('/task-stats',authenticateToken, taskController.getTaskStats);


module.exports = router;