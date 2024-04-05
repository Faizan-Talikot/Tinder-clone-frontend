import React from 'react';
import { FaTrash } from 'react-icons/fa';

const AdminEventTable = ({ events, deleteEvent }) => {
    const reverseDate = (dateString) => {
        const parts = dateString.split('-');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      };
  return (
    <div className='eventcontainer'>
        <table className="event-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>College Name</th>
              <th>Event Date</th>
              <th>Participants</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td>{event.eventName}</td>
                <td>{event.college}</td>
                <td>{reverseDate(event.eventDate)}</td>
                <td>{event.participants.length}</td>
                <td>
                  <button onClick={() => deleteEvent(event._id)} className='deleventbtn'>
                  <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

  );
};

export default AdminEventTable;
