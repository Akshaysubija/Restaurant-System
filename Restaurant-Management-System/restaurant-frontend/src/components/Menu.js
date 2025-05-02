// // menu page //
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import '../App.css';

// const Menu = () => {
//   const [menuItems, setMenuItems] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [activeCategory, setActiveCategory] = useState('All');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchMenu = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/menu');
//         setMenuItems(response.data);
//         setFilteredItems(response.data);
//         const uniqueCategories = ['All', ...new Set(response.data.map(item => item.category))];
//         setCategories(uniqueCategories);
//       } catch (error) {
//         console.error('Error fetching menu:', error);
//       }
//     };

//     fetchMenu();
//   }, []);

//   const handleFilter = (category) => {
//     setActiveCategory(category);
//     if (category === 'All') {
//       setFilteredItems(menuItems);
//     } else {
//       const filtered = menuItems.filter(item => item.category === category);
//       setFilteredItems(filtered);
//     }
//   };

//   const handleOrderNow = async (item) => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.post(
//         'http://localhost:5000/api/orders',
//         {
//           items: [
//             {
//               menuItem: item._id,
//               quantity: 1,
//               price: item.price,
//             },
//           ],
//           totalPrice: item.price,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       alert('Order placed successfully!');
//       navigate('/orders'); // Go to orders page to see your orders//
//     } catch (error) {
//       console.error('Failed to place order:', error);
//       alert('Failed to place order.');
//     }
//   };

//   return (
//     <div className="menu-container">
//       <h2 className="menu-heading">🍽️ Our Menu</h2>

//       <div className="menu-filters">
//         {categories.map((category, index) => (
//           <button
//             key={index}
//             className={activeCategory === category ? 'filter-button active' : 'filter-button'}
//             onClick={() => handleFilter(category)}
//           >
//             {category}
//           </button>
//         ))}
//       </div>

//       <div className="menu-grid">
//         {filteredItems.length > 0 ? (
//           filteredItems.map(item => (
//             <div className="menu-card" key={item._id}>
//               <img src={item.image} alt={item.name} className="menu-image" />
//               <h3>{item.name}</h3>
//               <p className="menu-category">{item.category}</p>
//               <p className="menu-description">{item.description}</p>
//               <p className="menu-price">₹{item.price}</p>
//               <button className="order-button" onClick={() => handleOrderNow(item)}>
//                 Order Now
//               </button>
//             </div>
//           ))
//         ) : (
//           <p>Loading menu...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Menu;







import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/menu');
        setMenuItems(response.data);
        setFilteredItems(response.data);
        const uniqueCategories = ['All', ...new Set(response.data.map(item => item.category))];
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching menu:', error);
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleFilter = (category) => {
    setActiveCategory(category);
    if (category === 'All') {
      setFilteredItems(menuItems);
    } else {
      const filtered = menuItems.filter(item => item.category === category);
      setFilteredItems(filtered);
    }
  };

  const handleOrderNow = async (item) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/orders',
        {
          items: [{
            menuItem: item._id,
            quantity: 1,
            price: item.price,
          }],
          totalPrice: item.price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order.');
    }
  };

  return (
    <div className="menu-container">
      <h2 className="menu-heading">🍽️ Our Menu</h2>

      <div className="menu-filters">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`filter-button ${activeCategory === category ? 'active' : ''}`}
            onClick={() => handleFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="loading-text">Loading menu...</p>
      ) : (
        <div className="menu-grid">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div className="menu-card" key={item._id}>
                <img
                  src={item.image || 'https://via.placeholder.com/150'}
                  alt={item.name}
                  className="menu-image"
                />
                <h3>{item.name}</h3>
                <p className="menu-category">{item.category}</p>
                <p className="menu-description">{item.description}</p>
                <p className="menu-price">₹{item.price}</p>
                <button className="order-button" onClick={() => handleOrderNow(item)}>
                  Order Now
                </button>
              </div>
            ))
          ) : (
            <p>No menu items available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Menu;
