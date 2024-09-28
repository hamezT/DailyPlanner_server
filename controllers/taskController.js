const Task = require('../models/Task');
const TaskStats = require('../models/TaskStats');
const mongoose = require('mongoose');

// Get all tasks for a user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.userId });

    // Convert to plain object and include createdBy
    const tasksWithCreatedBy = tasks.map(task => ({ ...task.toObject(), createdBy: task.createdBy }));

    res.status(200).json(tasksWithCreatedBy);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Add a new task
exports.addTask = async (req, res) => {
  const { title, date, time, location, participants, notes, status, reviewedBy, reminders } = req.body;

  try {
    const newTask = new Task({
      title,
      date,
      time,
      location,
      participants,
      notes,
      status,
      reviewedBy,
      createdBy: req.user.userId,
      reminders,
    });

    await newTask.save();

    // Update task statistics for the user
    let taskStats = await TaskStats.findOne({ user: req.user.userId });
    if (!taskStats) {
      taskStats = new TaskStats({ user: req.user.userId, tasksCreated: 1 });
    } else {
      taskStats.tasksCreated += 1;
    }
    await taskStats.save();

    // Trả về thông tin task bao gồm createdBy
    res.status(201).json({ message: 'Task added successfully', task: { ...newTask.toObject(), createdBy: req.user.userId } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// Update an existing task
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, date, time, location, participants, notes, status, reviewedBy, reminders } = req.body;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.title = title || task.title;
    task.date = date || task.date;
    task.time = time || task.time;
    task.location = location || task.location;
    task.participants = participants || task.participants;
    task.notes = notes || task.notes;
    task.status = status || task.status;
    task.reviewedBy = reviewedBy || task.reviewedBy;
    task.reminders = reminders || task.reminders;

    await task.save();

    // Update task statistics if the status changed
    if (status) {
      const taskStats = await TaskStats.findOne({ user: task.createdBy });

      if (taskStats) {
        if (status === 'completed') {
          taskStats.tasksCompleted += 1;
        } else if (status === 'in-progress') {
          taskStats.tasksInProgress += 1;
        }
        await taskStats.save();
      }
    }

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Xóa task
exports.deleteTask = async (req, res) => {
  const { id } = req.params; // Trích xuất ID từ params

  console.log('Đang cố gắng xóa task với ID:', id); // Ghi log ID để kiểm tra

  try {
    const task = await Task.findByIdAndDelete(id); // Sử dụng ID để tìm và xóa task

    // Kiểm tra nếu task không tồn tại trước khi trả về phản hồi
    if (!task) {
      return res.status(404).json({ message: 'Không tìm thấy task' });
    }

    // Nếu đã xóa thành công, trả về thông báo thành công
    res.status(200).json({ message: 'Xóa task thành công' });
  } catch (error) {
    // Đảm bảo rằng bạn đang xử lý lỗi đúng cách
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};


// Lấy chi tiết task theo ID
exports.getTaskDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    // Check if the task exists
    if (!task) {
      return res.status(404).json({ message: 'Không tìm thấy task' });
    }

    // Verify access
    if (task.createdBy && task.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Không có quyền truy cập vào task này' });
    }

    // Return task details including createdBy
    res.status(200).json({
      ...task.toObject(), // Convert to plain object
      createdBy: task.createdBy // Ensure createdBy is included
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};


// Get task statistics for the user
exports.getTaskStats = async (req, res) => {
  try {
    // Đếm số lượng task theo từng trạng thái
    const tasksCreated = await Task.countDocuments({ createdBy: req.user.userId, status: 'new' });
    const tasksInProgress = await Task.countDocuments({ createdBy: req.user.userId, status: 'in-progress' });
    const tasksCompleted = await Task.countDocuments({ createdBy: req.user.userId, status: 'completed' });
    const tasksClosed = await Task.countDocuments({ createdBy: req.user.userId, status: 'closed' });

    // Trả về thông tin thống kê
    res.status(200).json({
      tasksCreated,
      tasksInProgress,
      tasksCompleted,
      tasksClosed,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

