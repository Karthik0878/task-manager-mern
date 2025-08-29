
import { Router } from 'express';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';

const router = Router();
router.use(auth);

router.get('/', async (req, res) => {
  const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const { title } = req.body;
  const task = await Task.create({ user: req.user.id, title });
  res.status(201).json(task);
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const task = await Task.findOneAndUpdate(
    { _id: id, user: req.user.id },
    { $set: { ...(title!==undefined?{title}:{}) , ...(completed!==undefined?{completed}:{}) } },
    { new: true }
  );
  if (!task) return res.status(404).json({ message: 'Not found' });
  res.json(task);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });
  if (!task) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

export default router;
