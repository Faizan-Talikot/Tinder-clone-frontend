const Chat = ({descendingOrderMessages}) => {
  return (
      <>
          <div className="chat-display">
              {descendingOrderMessages.map((message, _index) => (
                  <div key={_index}>
                      <div className="chat-message-header">
                          <div className="img-container">
                              <img src={require(`../images/${message.img}`)} alt={message.name + ' profile'}/>
                          </div>
                          <p>{message.name}</p>
                      </div>
                      <p style={{marginLeft:"12px"}}>{message.message}</p>
                  </div>
              ))}
          </div>
      </>
  )
}

export default Chat