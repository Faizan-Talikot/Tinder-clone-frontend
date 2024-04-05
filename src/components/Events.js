import React, { useEffect, useState } from "react";
import whitelogo from "../images/tinder_logo_white.png";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import axios from "axios";
import { useCookies } from "react-cookie";


const Events = () => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [cookies] = useCookies(["UserId"]);

  const back = () => {
    navigate("/dashboard");
  };

  const joinEvent = async (eventId) => {
    try {
      // Check if the user is already a participant
      const event = events.find((event) => event._id === eventId);
      if (event && event.participants.includes(cookies.UserId)) {
        console.log("User is already a participant of this event");
        // No need to proceed if user is already a participant
        return;
      }

      // Make API call to join event
      await axios.put(`http://localhost:8000/editevent/${eventId}`, {
        userId: cookies.UserId,
      });

      // Update events state after joining
      setEvents((prevEvents) => {
        const updatedEvents = prevEvents.map((event) => {
          if (event._id === eventId) {
            return { ...event, participants: [...event.participants, cookies.UserId] };
          }
          return event;
        });
        return updatedEvents;
      });
    } catch (error) {
      console.error("Error joining event:", error);
    }
  };

  const leaveEvent = async (eventId) => {
    try {
      // Make API call to leave event
      await axios.put(`http://localhost:8000/leaveevent/${eventId}`, {
        userId: cookies.UserId,
      });

      // Update events state after leaving
      setEvents((prevEvents) => {
        const updatedEvents = prevEvents.map((event) => {
          if (event._id === eventId) {
            return { ...event, participants: event.participants.filter((id) => id !== cookies.UserId) };
          }
          return event;
        });
        return updatedEvents;
      });
    } catch (error) {
      console.error("Error leaving event:", error);
    }
  };

  const handleButtonClick = async (eventId) => {
    const event = events.find((event) => event._id === eventId);
    const isUserParticipant = event.participants.some((participant) => participant.userId === cookies.UserId);

    if (isUserParticipant) {
      await leaveEvent(eventId);
    } else {
      await joinEvent(eventId);
    }

    // After updating the events, set the state again
    fetchEvents();
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/allevents");
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const reverseDate = (dateString) => {
    const parts = dateString.split('-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  return (
    <>
      <div className="nav-div">
        <img src={whitelogo} alt="Tinder Logo" />
        <button onClick={back}>Dashboard</button>
      </div>
      <h1 className="event-h1">Our Events</h1>
      {loading && (
        <div style={{ marginTop: "13rem", fontSize: "5rem" }}>
          {<PulseLoader color="#FE3072" size={30} />}
          {<p style={{ display: "inline", marginLeft: "62px" }}>Loading...</p>}
        </div>
      )}
      {!loading && (
        <div className="event-container">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <p className="date">{reverseDate(event.eventDate)}</p>
              <h2>{event.eventName}</h2>
              <p className="college">{event.college}</p>
              <p className="descrip">
                <span style={{ color: "black", fontWeight: "bold" }}>Description:</span> {event.eventDetails}
              </p>
              <div className="participants-list">
              <ul>
                <p>Participants:</p>
                {event.participants.length === 0
                  ? "No Participants"
                  : event.participants.map((participant, index) => (
                      <li key={index}>
                        {typeof participant === "object" ? (
                          <div>
                            <img src={require(`../images/${participant.imageUrl}`)} />
                            <span>{participant.name}</span>
                          </div>
                        ) : (
                          participant
                        )}
                      </li>
                    ))}
              </ul>
              </div>
              <button className={`join-event-btn ${event.participants.some((participant) => participant.userId === cookies.UserId) ? "leave-event" : ""}`} onClick={() => handleButtonClick(event._id)}>
                {event.participants.some((participant) => participant.userId === cookies.UserId) ? "Leave Event" : "Join Event"}
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Events;
