import React, { useState } from 'react'
import ChatDisplay from './ChatDisplay'
import MatchesDisplay from './MatchesDisplay'
import ChatHeader from './ChatHeader'

const ChatContainer = ({ user , gotmatch , toggleVisibility, isVisible}) => {
  const [clickedUser,setClickedUser]  = useState(null)
  const [gotmatch1] = useState(gotmatch)

  return (
    <div className='chat-container'>
       <ChatHeader user={user} toggleVisibility={toggleVisibility}/>
       <div className='matches' style={{display: isVisible ? 'none' : 'block' }}>
        <button className='option' onClick={()=>{setClickedUser(null)}}>Matches</button>
        <button className='option' disabled={!clickedUser}>Chat</button>
       </div >
       {!clickedUser && <MatchesDisplay matches={user.matches} setClickedUser={setClickedUser} gotmatch1={gotmatch1} isVisible={isVisible}/>}
       {clickedUser && <ChatDisplay user={user} clickedUser={clickedUser}/>}
    </div>
  )
}

export default ChatContainer
