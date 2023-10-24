import React from 'react'
import { useState } from 'react'
import axios from 'axios'

const ChatInput = ({ user, clickedUser, getUserMessages, getClickedUsersMessages }) => {
    const [textArea,setTextArea] = useState('')
    const [isdisable,setIsDisable] = useState(false)
    const userId = user?.user_id
    const clickedUserId = clickedUser?.user_id

    const addMessage = async () => {
       console.log("inside addmessgae")
        const message = {
            timestamp: new Date().toISOString(),
            from_userId: userId,
            to_userId: clickedUserId,
            message: textArea
        }

        if(textArea!=''){
          try {
              setIsDisable(true)
              await axios.post('http://localhost:8000/message', { message })
              getUserMessages()
              getClickedUsersMessages()
              setIsDisable(false)
              setTextArea("")
          } catch (error) {
              console.log(error)
          }
        }
    }
  return (
    <div className='chat-input'>
      <textarea value={textArea} onChange={(e)=>setTextArea(e.target.value)}/>
      <button className='secondary-button' onClick={addMessage} disabled={isdisable}>Submit</button>
    </div>
  )
}

export default ChatInput
