
// controllers/feedbackController.js //
import Feedback from '../models/Feedback.js';

export const submitFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create({ ...req.body, user: req.user.id });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
