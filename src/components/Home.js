import React from "react";
import Nav from "./Nav";
import AuthModal from "./AuthModal";
import { useState } from "react";
import { useCookies } from 'react-cookie'

const Home = ({loading}) => {
  const [showModal,setShowModal] = useState(false);
  const [isSignUp,setIsSignUp] = useState(true)
  const [cookies,setCookie,removeCookie] = useCookies(['user'])
  const [load,setLoading] = useState(loading)

  const authToken = cookies.AuthToken
  console.log(load,"of home")

  const handleClick = () => {
    if (authToken) {
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
    {load && <p>Loading...</p>}
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
