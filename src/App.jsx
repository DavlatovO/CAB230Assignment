import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import RentalSearch from "./pages/RentalSearch.jsx"
import AppLayout from "./components/AppLayout.jsx";
import './styles/global.css';
import './styles/rental-page.css';
import './styles/rental-search.css'
import './styles/login-register.css';
import './styles/rated-rental.css';
import './styles/about.css'
import './styles/home.css'
import Rentals from "./pages/Rentals.jsx";
import RatedRental from "./pages/RatedRentals.jsx";
import NotFound from "./services/NotFound.jsx";

const router = createBrowserRouter([
    {path: "/",
    Component: AppLayout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "rentalSearch", Component: RentalSearch },
      { path: "ratedRentals", Component: RatedRental },
      { path: "rentals/:id", Component: Rentals },
      { path: "*", Component: NotFound},
      
    ]
  }
  ]);


function App() {
  
  return <RouterProvider router = {router} />
}

export default App
