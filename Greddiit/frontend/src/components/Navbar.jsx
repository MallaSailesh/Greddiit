import React from "react";
import { Link, useNavigate } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import BookmarkIcon from '@mui/icons-material/Bookmark';

function Navbar() {

    const navigate = useNavigate();

    function Logout() {
        localStorage.removeItem('token');
        navigate("/");
    }

    return (
        <div className="container-fluid">
            <nav className="navbar navbar-expand-lg navbar-dark">
                <Link className="navbar-brand" to="">Greddiit</Link>
                <button className="navbar-toggler" type="button">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/home"><HomeIcon/> <span>Home</span></Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/sub-greddiit"> <PeopleIcon/> <span>MySubGreddiits</span> </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/savedPosts"><BookmarkIcon/> <span>SavedPosts</span></Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/profile"><PersonIcon/> <span>Profile</span></Link>
                        </li>
                        {
                            localStorage.getItem('token') &&
                            <li className="nav-item">
                                <Link className="nav-link" onClick={Logout}><LogoutIcon/> <span>Logout</span></Link>
                            </li>
                        }
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;

