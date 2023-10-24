import React, {useState} from 'react'
import { useCookies } from 'react-cookie'
import {useNavigate} from 'react-router-dom'
import swal from 'sweetalert'
import axios from 'axios'
import { useSocket } from './SocketContext'

const ChatHeader = ({ user }) => {
  /*eslint-disable*/
  const socket = useSocket();
  let navigate = useNavigate()
  const [cookies,removeCookie] = useCookies(['user'])
  const [isOnline] = useState(true);
  const userId = cookies?.UserId
 
  const logout = ()=>{
    swal({
      title: "Are you sure you want to logout",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        console.log("demounting")
        try{
          console.log("inside try")
          socket.disconnect();
        }catch(err){
          console.log("erro",err)
        }
        removeCookie('UserId',cookies.UserId)
        removeCookie('AuthToken',cookies.AuthToken)
       //  window.location.reload()
        navigate ('/')
        
      }
    });
  }
  const updateStatus = async()=>{
    console.log("update status called")
    try{
       await axios.put('http://localhost:8000/updatestatus',{isOnline , userId})
    }catch(err){
        console.log(err)
    }
  }
 
  let userurl = user.url;

  return (
    <div className='chat-container-header'>
      <div className="profile">
        <div className="img-container">
            <img src={require(`../images/${userurl}`)} alt={"photo of"+user.first_name}/>
        </div>
        <h3>{user.first_name}</h3>
      </div>
      <i className='log-out-icon' onClick={logout}>⇦</i>
    </div>  
  )
}

export default ChatHeader
