import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import RentalSearch from "./pages/RentalSearch.jsx"
import AppLayout from "./components/AppLayout.jsx";
import './styles/global.css'

const router = createBrowserRouter([
    {path: "/",
    Component: AppLayout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "rentalSearch", Component: RentalSearch },
      

    ]
  }
  ])


function App() {
  
  return <RouterProvider router = {router} />
}

export default App
