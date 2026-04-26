import { BrowserRouter,Routes,Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import Login from './login.jsx'
import Register from './register.jsx'
import Chat from './chat.jsx'
import Landing from './landingpage.jsx'
import axios from 'axios'
import VerifyEmail from './verifyemail.jsx'

axios.defaults.withCredentials = true; 

createRoot(document.getElementById('root')).render(
  <BrowserRouter> 
  <Routes>
    <Route path='/' element={<Landing/>}>
</Route>
<Route path='/login' element={<Login/>}>
</Route>
<Route path='/register' element={<Register/>}></Route>
<Route path='/chat' element={<Chat/>}></Route>
<Route path='/verifyemail' element={<VerifyEmail/>}></Route>

  </Routes>
  </BrowserRouter>
 
)