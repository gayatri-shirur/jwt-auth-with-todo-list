const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/tasks
// @desc    Get all tasks for the logged-in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    
    // Build query object
    const query = { user: req.user._id };
    
    // Filter by status if provided
    if (status && ['pending', 'in-progress', 'completed'].includes(status)) {
      query.status = status;
    }
    
    // Search by title if provided
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get a single task
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('status')
      .optional()
      .isIn(['pending', 'in-progress', 'completed'])
      .withMessage('Invalid status'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Invalid priority'),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, status, priority } = req.body;

      const task = await Task.create({
        title,
        description: description || '',
        status: status || 'pending',
        priority: priority || 'medium',
        user: req.user._id,
      });

      res.status(201).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put(
  '/:id',
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('status')
      .optional()
      .isIn(['pending', 'in-progress', 'completed'])
      .withMessage('Invalid status'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Invalid priority'),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const task = await Task.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Update fields
      if (req.body.title !== undefined) task.title = req.body.title;
      if (req.body.description !== undefined) task.description = req.body.description;
      if (req.body.status !== undefined) task.status = req.body.status;
      if (req.body.priority !== undefined) task.priority = req.body.priority;

      const updatedTask = await task.save();
      res.json(updatedTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: 'Task removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

