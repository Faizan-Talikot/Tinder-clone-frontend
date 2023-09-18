import Home from './components/Home'
import Dashboard from './components/Dashboard';
import Onboarding from './components/Onboarding';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { useCookies } from 'react-cookie';
import { useState } from 'react';

const App = () => {
  const [cookies,setCookie,removeCookie] = useCookies(['user'])
  const [loading,setLoading] = useState(false)

  const authToken = cookies.AuthToken
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home  loading={loading}/>}/>
        {authToken && <Route path="/dashboard" element={<Dashboard />}/>}
        {authToken && <Route path="/onboarding" element={<Onboarding loading={loading}/>}/>}
      </Routes>
    </BrowserRouter>
  ); 
}

export default App 
