import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {useCookies} from 'react-cookie'
import swal from 'sweetalert'
import {BsEye,BsEyeSlash} from 'react-icons/bs'

const AuthModal = ({setShowModal,isSignUp,loading,setLoading }) => {
    /*eslint-disable */
   const[email, setEmail] = useState(null)
   const[password, setPassword] = useState(null)
   const[confirmPassword, setConfirmPassword] = useState(null)
   const[error, setError] = useState(null)
   const[cookies, setCookie, removeCookie] = useCookies(['user'])
   const[showPassword,setShowPassword] = useState(false)

  useEffect(()=>{

  },[loading])
   let navigate = useNavigate()

    const handleClick = ()=>{
        setShowModal(false)
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            if(isSignUp && (password !== confirmPassword)){
                setError('Passwords need to match!')
                return
            }
            setError(null)

            
            if (email === 'admin@gmail.com' && password === 'admin') {
                navigate('/admin'); // Navigate to the admin panel if the credentials match
                return;
              }

            setLoading(true)
            let response;
            try{
                 response = await axios.post(`http://localhost:8000/${isSignUp ? 'signup':'login'}`,{email,password})
            }
            catch(err){
                 setLoading(false)
                 console.log(err)
                 if(isSignUp){
                     swal({
                         title: "SIGN UP ERROR!",
                         text: "User Already Exists. Please Try Login!",
                         icon: "error",
                         button: "ok",
                       });
                 }
                 else{
                    swal({
                        title: "LOGIN ERROR!",
                        text: "Invalid Credentials. Please Try Again!",
                        icon: "error",
                        button: "ok",
                      });
                 }
            }


            setCookie('UserId',response.data.userId)
            setCookie('AuthToken',response.data.token)
            

            const success = response.status ===201

            if(success && isSignUp) navigate ('/onboarding')
            if(success && !isSignUp) navigate ('/dashboard')

            window.location.reload()
           
        } catch(error){
            console.log(error)
        }
    }


    const togglepassword = (e)=>{
        e.preventDefault()
        const password = document.querySelector('#password');
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        setShowPassword(showPassword=>!showPassword)
       }

  return (
    <div className='auth-modal'>
      <div className='close-icon' onClick={handleClick}>ⓧ</div>
      <h2>{isSignUp? "CREATE ACCOUNT":"LOG IN"}</h2>
      <p>By clicking Log In, you agree to our terms. Learn how we process your data in our <a href="https://policies.tinder.com/terms/intl/en/">Privacy Policy and Cookie Policy.</a></p>
      <form onSubmit={handleSubmit}>
          <input
              type="email"
              id="email"
              name="email"
              placeholder='email'
              required={true}
              onChange={(e) => setEmail(e.target.value)}
          />
          {<div style={{position:"relative"}} ><input
              type="password"
              id="password"
              name="password"
              placeholder='password'
              required={true}
              onChange={(e) => setPassword(e.target.value)}
              style={{width:"-webkit-fill-available",display:"block"}}
          /> 
          <button className='icon-button'onClick={togglepassword}>
            {!showPassword && <BsEye className='icon' />}
            {showPassword && <BsEyeSlash className='icon' />}
            </button>
          
          </div>}
          
          {isSignUp && <input
              type="password"
              id="password-check"
              name="password-check"
              placeholder='confirm password'
              required={true}
              onChange={(e) => setConfirmPassword(e.target.value)}
          />}
          <input className="secondary-button" type='submit'/>
          <p>{error}</p>
      </form>
      <hr/>
      <h2>GET THE APP</h2>

    </div>
  )
}

export default AuthModal
