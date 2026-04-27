import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import RentalSearch from "./pages/RentalSearch.jsx"
import AppLayout from "./components/AppLayout.jsx";
import './styles/global.css';
import './styles/pages.css';
// import './styles/test.css'
import Test from './pages/Test.jsx';
import Rentals from "./pages/Rentals.jsx";

const router = createBrowserRouter([
    {path: "/",
    Component: AppLayout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "rentalSearch", Component: RentalSearch },
      { path: "rentals", Component: Rentals },
      

    ]
  }
  ])


function App() {
  
  return <RouterProvider router = {router} />
}

export default App
