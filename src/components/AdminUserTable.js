import React from 'react'
import { FaTrash } from 'react-icons/fa';


const AdminUserTable = ({users,deleteUser}) => {
  return (
    <div>
      <div className="user-table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>College</th>
            <th>Matches</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td>{user.first_name}</td>
              <td>{user.gender_identity}</td>
              <td>{user.college}</td>
              <td>{user.matches?.length}</td>
              <td>{user.status ? "Online" : "Offline"}</td> 
              <td>
                <button onClick={() => deleteUser(user.user_id)} className='delbtn'>
                <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  )
}

export default AdminUserTable
