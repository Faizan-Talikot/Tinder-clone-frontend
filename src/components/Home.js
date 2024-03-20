import React from "react";
import Nav from "./Nav";
import AuthModal from "./AuthModal";
import { useState } from "react";
import { useCookies } from 'react-cookie'
import PulseLoader from "react-spinners/PulseLoader"

const Home = ({loading}) => {
  const [showModal,setShowModal] = useState(false);
  const [isSignUp,setIsSignUp] = useState(true)
  // eslint-disable-next-line
  const [cookies,setCookie,removeCookie] = useCookies(['user'])
  const [load,setLoading] = useState(loading)

  const authToken = cookies.AuthToken
  console.log(load,"of home")

  const handleClick = () => {
    console.log("india")
    if (authToken) {
      console.log('removing cookie')
      removeCookie('UserId', cookies.UserId)
      removeCookie('AuthToken', cookies.AuthToken)
      window.location.reload()
      return
  }

    setShowModal(true)
    setIsSignUp(true)
  };

  

  return (
    <>
    {load && <div style={{marginTop: "13rem",fontSize: "5rem"}}>
    {<PulseLoader color="#FE3072"  size={30}/>}
    {<p style={{display:"inline",marginLeft:"62px"}}>Loading...</p>}
    </div>}
    {!load &&
      <div className="overlay">
      <Nav
                authToken={authToken}
                minimal={false}
                setShowModal={setShowModal}
                showModal={showModal}
                setIsSignUp={setIsSignUp}
            />
        <div className="home">
          <h1 className="primary-title">Swipe Right©</h1>
          <button className="primary-button" onClick={handleClick}>
            {authToken ? "Signout" : "Create Account"}
          </button>

          {showModal &&(
            <AuthModal setShowModal={setShowModal} isSignUp={isSignUp} loading={loading} setLoading={setLoading}/>
          )}
        </div>
      </div>}
    </>
  );
};

export default Home;
