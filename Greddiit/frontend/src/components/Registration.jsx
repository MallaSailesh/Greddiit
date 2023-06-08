import React, { useEffect, useState } from "react";
import Register from "./Register";
import Navbar from "./Navbar";
import Login from "./Login";
import { NavLink, useNavigate } from "react-router-dom";

function Registration(props){
    
    const navigate = useNavigate();
    const [page, setPage] = useState('Login')

    function Redirect(event){
        const page = event.target.name;
        event.preventDefault();
        setPage(page);
    }
    
    return ( 
            <div>
                <Navbar />
                <div className="container">
                    <div className="cell-container1 image-tilt">
                        <img src="img1.png" alt="IMG"/>
                    </div>
                    <div className="cell-container2">
                        { page === 'Register' ? 
                            <Register anotherPage={Redirect}/> 
                            : 
                            <Login anotherPage={Redirect} /> 
                        }
                    </div>
                </div>
            </div> 
    );
}

export default Registration;
