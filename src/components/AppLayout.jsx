import { Outlet } from 'react-router-dom';
import NavBar from "./NavBar.jsx"
import Footer from './Footer.jsx';

export default function AppLayout() {
    return (
        <>
            <NavBar />
            <div className='main-wrapper'>
                <Outlet />
            </div>
            <Footer />
        
        </>
    );
}