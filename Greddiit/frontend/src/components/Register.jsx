import React, { useState } from "react";
import Input from "./Input";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

function Register(props) {

    const navigate = useNavigate();
    const GOOGLE_CLIENT_ID = "1003154537318-5s27e0955arrjl8solkstlq77k0ekvkd.apps.googleusercontent.com"

    const [user, setUser] = useState({
        FirstName: "",
        LastName: "",
        UserName: "",
        Email: "",
        Password: "",
        Age: "",
        PhoneNumber: ""
    });

    const [RemoveDisable, setRemoveDisable] = useState(true);

    React.useEffect( () => {
        if(user.UserName !== "" && user.Password !== "" && user.UserName !== ""){
            setRemoveDisable(false)
        }
    },[user,RemoveDisable]);

    function modify(event) {
        const { name, value } = event.target;
        setUser(prevValue => {
            return {
                ...prevValue,
                [name]: value
            }
        });
    }

    const Register = async (event) => {
        event.preventDefault();
        const response = await fetch("http://localhost:5000/auth/Register", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ FirstName: user.FirstName, LastName: user.LastName, UserName: user.UserName, Email: user.Email, Password: user.Password, Age: user.Age, PhoneNumber: user.PhoneNumber })
        });
        const json = await response.json();

        if (!json.success) {
            alert(json.message);
        } else {
            localStorage.setItem('token', json.token);
            // localStorage.setItem('token',true);
            navigate("/home");
        }
        setUser({
            FirstName: "",
            LastName: "",
            UserName: "",
            Email: "",
            Password: "",
            Age: "",
            PhoneNumber: ""
        })
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
                navigate("/home")
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form className="row g-3">
            <div className="col-md-6"><Input onChange={modify} type="text" rvalue={user.FirstName} placeholder="FirstName" /></div>
            <div className="col-md-6"><Input onChange={modify} type="text" rvalue={user.LastName} placeholder="LastName" /></div>
            <Input onChange={modify} type="text" rvalue={user.UserName} placeholder="UserName" />
            <div className="col-md-4"><Input onChange={modify} type="number" rvalue={user.Age} placeholder="Age" /></div>
            <div className="col-md-8"><Input onChange={modify} type="tel" rvalue={user.PhoneNumber} placeholder="PhoneNumber" /></div>
            <Input onChange={modify} type="email" rvalue={user.Email} placeholder="Email" />
            <Input onChange={modify} type="password" rvalue={user.Password} placeholder="Password" />
            <button className="btn btn-lg btn-outline-success btn-opacity auth-btn col-md-6" onClick={Register} disabled={RemoveDisable}>Register</button>
            <p>Aldready have an account ? <a href="" name="Login" onClick={props.anotherPage}>Login Here</a></p>
            <div className="google-register">
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
        </form>
    );
}

export default Register;
