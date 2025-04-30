// reservation page //
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../App.css';

const ReservationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    partySize: 1,
  });

  const [myReservations, setMyReservations] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchMyReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/reservations/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyReservations(res.data);
    } catch (err) {
      toast.error('Failed to fetch reservations');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/reservations', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Reservation made successfully!');
      setFormData({ name: '', phone: '', date: '', time: '', partySize: 1 });
      fetchMyReservations();
    } catch (err) {
      toast.error('Failed to make reservation');
    }
  };

  useEffect(() => {
    fetchMyReservations();
  }, []);

  return (
    <div className="reservation-background">
      <div className="reservation-page">
        <h2 className="reservation-title">Book a Table</h2>

        <form onSubmit={handleSubmit} className="reservation-form">
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          <input type="time" name="time" value={formData.time} onChange={handleChange} required />
          <input type="number" name="partySize" min="1" value={formData.partySize} onChange={handleChange} required />
          <button type="submit">Book Now</button>
        </form>

        <div className="my-reservations">
          <h3>My Reservations</h3>
          {myReservations.length === 0 ? (
            <p className="empty-message">No reservations yet.</p>
          ) : (
            <ul className="reservation-list">
              {myReservations.map((r) => (
                <li key={r._id} className="reservation-card">
                  <p><strong>Name:</strong> {r.name}</p>
                  <p><strong>Phone:</strong> {r.phone}</p>
                  <p><strong>Date:</strong> {r.date}</p>
                  <p><strong>Time:</strong> {r.time}</p>
                  <p><strong>Party Size:</strong> {r.partySize}</p>
                  <p><strong>Status:</strong> {r.status}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;





// import React, { useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const AdminReservationCard = ({ reservation }) => {
//   const [status, setStatus] = useState(reservation.status);

//   const handleStatusChange = async (newStatus) => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.put(`http://localhost:5000/api/reservations/${reservation._id}/status`, 
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setStatus(newStatus);
//       toast.success(`Reservation status updated to ${newStatus}`);
//     } catch (error) {
//       toast.error('Failed to update status');
//     }
//   };

//   return (
//     <div className="reservation-card">
//       <p><strong>Name:</strong> {reservation.name}</p>
//       <p><strong>Phone:</strong> {reservation.phone}</p>
//       <p><strong>Date:</strong> {reservation.date}</p>
//       <p><strong>Time:</strong> {reservation.time}</p>
//       <p><strong>Party Size:</strong> {reservation.partySize}</p>
//       <p><strong>Status:</strong> {status}</p>
//       <div>
//         <button onClick={() => handleStatusChange('Confirmed')}>Confirm</button>
//         <button onClick={() => handleStatusChange('Cancelled')}>Cancel</button>
//       </div>
//     </div>
//   );
// };

// export default AdminReservationCard;
