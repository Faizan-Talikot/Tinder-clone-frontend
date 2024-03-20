const Chat = ({descendingOrderMessages,currentUser, isVisible}) => {
  return (
      <>
          <div className="chat-display" style={{display: isVisible ? 'none' : '' }}>
              {descendingOrderMessages.map((message, _index) => (
                  <div key={_index}>
                      <div className={`chat-message-header  ${message.name === currentUser.first_name ? 'sender' : 'receiver'}`}>
                          <div className="img-container">
                              <img src={require(`../images/${message.img}`)} alt={message.name + ' profile'}/>
                          </div>
                      <p style={{marginLeft:"12px"}}>{message.message}</p>
                          {/* <p>{message.name}</p> */}
                      </div>
                  </div>
              ))}
          </div>
      </>
  )
}

export default Chat