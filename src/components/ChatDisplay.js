import React, { useEffect } from 'react'
import ChatInput from './ChatInput'
import Chat from './Chat'
import { useState } from 'react'
import axios from 'axios'

const ChatDisplay = ({user , clickedUser , isVisible}) => {
    /*eslint-disable */
  const userId = user?.user_id
    const clickedUserId = clickedUser?.user_id
    const [usersMessages, setUsersMessages] = useState(null)
    const [clickedUsersMessages, setClickedUsersMessages] = useState(null)

    const getUsersMessages = async () => {
      try {
             const response = await axios.get('http://localhost:8000/messages', {
                 params: { userId: userId, correspondingUserId: clickedUserId}
             })
          setUsersMessages(response.data)
         } catch (error) {
          console.log(error)
      }
     }
 
     const getClickedUsersMessages = async () => {
         try {
             const response = await axios.get('http://localhost:8000/messages', {
                 params: { userId: clickedUserId , correspondingUserId: userId}
             })
             setClickedUsersMessages(response.data)
         } catch (error) {
             console.log(error)
         }
     }

   useEffect(()=>{
    getUsersMessages()
    getClickedUsersMessages()
   },[usersMessages,clickedUsersMessages])

  //  console.log(usersMessages)

  // Play notification sound when a new message is received
//   useEffect(() => {
//     const newMessageReceived = () => {
//         // Assuming you have a notification sound file named 'notification.mp3' in the public folder
//         const audio = new Audio('/tinder-notification-sound.mp3')
//         audio.play()
//     }

//     if (usersMessages !== null || clickedUsersMessages !== null) {
//         newMessageReceived()
//     }
// }, [usersMessages, clickedUsersMessages])


   const currentUser = user;
   const messages = []

    usersMessages?.forEach(message => {
        const formattedMessage = {}
        formattedMessage['name'] = user?.first_name
        formattedMessage['img'] = user?.url
        formattedMessage['message'] = message.message
        formattedMessage['timestamp'] = message.timestamp
        messages.push(formattedMessage)
    })

    clickedUsersMessages?.forEach(message => {
        const formattedMessage = {}
        formattedMessage['name'] = clickedUser?.first_name
        formattedMessage['img'] = clickedUser?.url
        formattedMessage['message'] = message.message
        formattedMessage['timestamp'] = message.timestamp
        messages.push(formattedMessage)
    })

    const descendingOrderMessages = messages?.sort((a,b) => a.timestamp.localeCompare(b.timestamp))

    return (
        <>
        {<Chat descendingOrderMessages={descendingOrderMessages} currentUser={currentUser} isVisible={isVisible}/>}
     <ChatInput 
         user={user}
         clickedUser={clickedUser} getUserMessages={getUsersMessages} getClickedUsersMessages={getClickedUsersMessages} isVisible={isVisible}/>
        </>
    )
}

export default ChatDisplay
