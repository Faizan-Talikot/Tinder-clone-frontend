import React from "react";
import im1 from "../images/tinder_logo_white.png";
import { useState } from "react";
import AdminUserTable from "./AdminUserTable";
import AddEvent from "./AddEvent";
import AdminEventTable from "./AdminEventTabel";
import { useEffect } from "react";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader"
import swal from 'sweetalert'
import { TbLogout2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  let navigate = useNavigate();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeButton, setActiveButton] = useState('Users'); // State to track active button

   // Function to toggle visibility of admin nav
   const toggleNavVisibility = () => {
    setIsNavVisible(!isNavVisible); // Toggle the state value
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await axios.get('http://localhost:8000/allusers'); 
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const response = await axios.get('http://localhost:8000/allevents');
        setEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    swal({
      title: "Are you sure you want to Delete user",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then(async (willDelete) => {
      if (willDelete) {
        try {
          // Make a request to your backend to delete the user with the provided userId
          await axios.delete("http://localhost:8000/deluser", {
              params: { userId },
            });
            const response = await axios.get('http://localhost:8000/allusers'); 
            setUsers(response.data);
        } catch (error) {
          console.error('Error deleting user:', error);
        }
        
      }
    });
  };

  const deleteEvent = async (eventId) => {
    swal({
      title: "Are you sure you want to delete the event?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then(async (willDelete) => {
      if (willDelete) {
        try {
          // Make a request to your backend to delete the event with the provided eventId
          await axios.delete("http://localhost:8000/delevent", {
            params: { eventId },
          });
          // After successfully deleting the event, you may want to update the events state
          const response = await axios.get('http://localhost:8000/allevents'); 
          setEvents(response.data);
        } catch (error) {
          console.error('Error deleting event:', error);
        }
      }
    });
  };
  

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    // Implement logic to switch to different content based on button clicked
    console.log('Switch to', buttonName);
  };

  const logout = ()=>{
    navigate("/")
  }
  


  return (
    <>
      <div className="overlay">
        <div className="panel-container">
          <div className="panel-main-container">
            <div className="admin-heading">
              <h2>Admin</h2>
              <TbLogout2 className="admin-logout" onClick={logout}/>
            </div>
            <div className="admin-content">
              <div className="admin-nav">
                <div className="admin-nav-header">
                  <img src={im1}></img>
                  <i className="admin-hamburger-icon" onClick={toggleNavVisibility}>{isNavVisible ? '✕' : '☰'}</i>
                </div>
                {isNavVisible && (
              <div className="admin-nav-links">
                <button><span className={activeButton === 'Users' ? 'highlight' : ''} onClick={() => handleButtonClick('Users')}>Users</span></button>
                    <button><span className={activeButton === 'Events' ? 'highlight' : ''} onClick={() => handleButtonClick('Events')}>Events</span></button>
                    <button><span className={activeButton === 'Add Event' ? 'highlight' : ''} onClick={() => handleButtonClick('Add Event')}>Add Event</span></button>
              </div>
            )}
              </div>
              <div className="admin-details">
              {loading && <div style={{marginTop: "13rem",fontSize: "5rem"}}>
    {<PulseLoader color="#FE3072"  size={30}/>}
    {<p style={{display:"inline",marginLeft:"62px"}}>Loading...</p>}
    </div>} 
                {!loading && activeButton === "Users" && <AdminUserTable users={users} deleteUser={deleteUser} />}
                {!loading && activeButton === "Add Event" && <AddEvent events={events} deleteEvent={deleteEvent}/>}
                {!loading && activeButton === "Events" && <AdminEventTable events={events} deleteEvent={deleteEvent}/>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
