import { Outlet } from 'react-router-dom';
import NavBar from "./NavBar.jsx"
import Footer from './Footer.jsx';

export default function AppLayout() {
    return (
        <div className='main-wrapper'>
            <NavBar />
            <Outlet />
            <Footer />
        </div>
    );
}