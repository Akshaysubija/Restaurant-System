// feedback //
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Feedback = () => {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/feedback',
        { rating, message }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Feedback submitted successfully!');
      setRating(5);
      setMessage('');
    } catch (err) {
      console.error('Error submitting feedback:', err);
      toast.error('Failed to submit feedback');
    }
  };

  return (
    <div className="feedback-container">
      <h2>Leave Your Feedback</h2>
      <form onSubmit={handleSubmit} className="feedback-form">
        <label>Rating:</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          <option value={5}>⭐️⭐️⭐️⭐️⭐️</option>
          <option value={4}>⭐️⭐️⭐️⭐️</option>
          <option value={3}>⭐️⭐️⭐️</option>
          <option value={2}>⭐️⭐️</option>
          <option value={1}>⭐️</option>
        </select>

        <label>Comments:</label>
        <textarea
          rows="4"
          placeholder="Write your feedback here..."
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default Feedback;
