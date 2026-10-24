import { BrowserRouter,Routes,Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { lazy, Suspense } from 'react'
import './App.css'
import { AppErrorBoundary, LoadingScreen } from './app-shell.jsx'

const Landing = lazy(() => import('./landingpage.jsx'))
const Login = lazy(() => import('./login.jsx'))
const Register = lazy(() => import('./register.jsx'))
const Chat = lazy(() => import('./chat.jsx'))
const VerifyEmail = lazy(() => import('./verifyemail.jsx'))
const HowItWorks = lazy(() => import('./howitworks.jsx'))

createRoot(document.getElementById('root')).render(
  <BrowserRouter> 
  <AppErrorBoundary><Suspense fallback={<LoadingScreen />}><Routes>
    <Route path='/' element={<Landing/>}>
</Route>
<Route path='/login' element={<Login/>}>
</Route>
<Route path='/register' element={<Register/>}></Route>
<Route path='/chat' element={<Chat/>}></Route>
<Route path='/verifyemail' element={<VerifyEmail/>}></Route>
<Route path='/how-it-works' element={<HowItWorks/>}></Route>

  </Routes></Suspense></AppErrorBoundary>
  </BrowserRouter>
 
)
