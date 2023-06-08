import React, { useState } from "react"
import { Navigate, useNavigate } from "react-router";
import Input from "./Input";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

function Login(props) {

    const navigate = useNavigate();
    const GOOGLE_CLIENT_ID = "1003154537318-5s27e0955arrjl8solkstlq77k0ekvkd.apps.googleusercontent.com"

    const [userDetails, setUserDetails] = useState({
        UserName: "",
        Password: ""
    });

    const [RemoveDisable, setRemoveDisable] = useState(true);

    React.useEffect( () => {
        if(userDetails.UserName !== "" && userDetails.Password !== ""){
            setRemoveDisable(false)
        }
    },[userDetails,RemoveDisable]);


    function modify(event) {
        const { name, value } = event.target;
        setUserDetails(prevItems => {
            return {
                ...prevItems,
                [name]: value
            }
        })
    }

    const Login = async (event) => {
        event.preventDefault();
        const response = await fetch("http://localhost:5000/auth/Login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ UserName: userDetails.UserName, Password: userDetails.Password })
        })

        const json = await response.json();

        if (!json.success) {
            window.location.reload();
            alert(json.message);
        } else {
            localStorage.setItem('token', json.token);
            navigate("/home")
        }
        setUserDetails({
            Email: "",
            Password: ""
        });
    }

    const handleGoogleLogin = async (token) => {
        try {
            // Send the Google OAuth2 ID token to the server
            const response = await fetch('http://localhost:5000/auth/google/Login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token : token })
            });
            const json = await response.json();
            if (!json.success) {
                alert(json.message);
            } else {
                localStorage.setItem('token', json.token);
                // localStorage.setItem('token',response.credential);
                navigate("/home")
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form className="row g-3" onSubmit={Login}>
            <div className="loginDiv">
                <Input onChange={modify} type="text" placeholder="UserName" rvalue={userDetails.UserName} />
            </div>
            <div className="col-auto col-md-12 bottom-div">
                <Input onChange={modify} type="password" placeholder="Password" rvalue={userDetails.Password} />
            </div>
            <button className="btn btn-lg btn-outline-success btn-opacity auth-btn col-md-6" disabled={RemoveDisable}>Login</button>
            <p>Don't have an account ? <a href="" name="Register" onClick={props.anotherPage}>Register Here</a></p>
            <div className="google-login">
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                    <GoogleLogin
                        onSuccess={response => {
                            handleGoogleLogin(response.credential);
                        }}
                        onError={() => {
                            console.log('Login Failed');
                            navigate("/");
                        }}
                    />
                </GoogleOAuthProvider>
            </div>
            <div>
                
            </div>
        </form>
    );
}

export default Login;

