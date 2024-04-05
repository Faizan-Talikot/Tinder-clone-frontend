import Home from './components/Home'
import Dashboard from './components/Dashboard';
import Onboarding from './components/Onboarding';
import AdminPanel from './components/AdminPanel';
import Events from './components/Events';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { useCookies } from 'react-cookie';
import { useState } from 'react';
import { SocketProvider } from './components/SocketContext';

const App = () => {
  const [cookies] = useCookies(['user'])
  const [loading] = useState(false)

  const authToken = cookies.AuthToken
  return (
    <SocketProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home  loading={loading}/>}/> {/*route to home */}
        {authToken && <Route path="/dashboard" element={<Dashboard />}/>}  {/*route to dashboard */}
        {authToken && <Route path="/onboarding" element={<Onboarding />}/>} { /*route to onboarding */}
        {<Route path="/admin" element={<AdminPanel />}/>} { /*route to AdminPanel */}
        {authToken && <Route path="/Events" element={<Events />}/>} { /*route to Events */}
      </Routes>
    </BrowserRouter>
    </SocketProvider>
  ); 
}

export default App 
