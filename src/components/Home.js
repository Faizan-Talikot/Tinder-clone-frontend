import React from 'react'
import Nav from './Nav'

const authToken = false

const handleClick = ()=>{
    console.log('clicked')
}

const Home = () => {
  return (
    <>
    <Nav/>
    <div className='home'>
      <h1>Swipe Right©</h1>
      <button className='primary-button' onClick={handleClick}>
        {authToken ? 'Signout':'Create Account'}
      </button>
    </div>
    </>
  )
}

export default Home
