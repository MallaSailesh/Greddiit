import Alert from '@mui/material/Alert';
import EditForm from './EditProfile';
import Navbar from '../Navbar';
import {Link} from "react-router-dom";
import React, { useEffect, useState } from 'react'
import Snackbar  from "@mui/material/Snackbar";
import { useNavigate } from 'react-router';

function Profile() {

  const [isProfileEdited, setIsProfileEdited] = React.useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [alert, setAlert] = React.useState({
    open : false ,
    severity : "success",
    message : ""
  });

  const [oldUser, setOldUser] = useState({
    oldEmail: "",
    oldUserName: "",
    editMode: false
  });
  

  const beforeUnload = (event) => {
    if (isProfileEdited) {
      event.preventDefault();
      event.returnValue = '';
      const result = window.confirm('Are you sure you want to discard your changes?');
      if (result) {
        setIsProfileEdited(false);
        window.history.back();
      }
    }
  }

  React.useEffect(() => {
    window.addEventListener('beforeunload', beforeUnload );
    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
    }
  })


  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/auth/Profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
      const json = await response.json();
      if (!json.success) {
        alert(json.message);
        navigate("/");
      } else {
        setUser({
          FirstName: json.userDetails.FirstName,
          LastName: json.userDetails.LastName,
          UserName: json.userDetails.UserName,
          Email: json.userDetails.Email,
          Age: json.userDetails.Age,
          PhoneNumber: json.userDetails.PhoneNumber,
          followers: json.followers,
          following: json.following
        });
      }
    }
    fetchData();
  }, []);

  function EditMode() {
    setOldUser({ oldEmail: user.Email, oldUserName: user.UserName, editMode: true });
  }

  function ViewMode(e) {
    e.preventDefault()
    window.location.reload();
  }

  function modify(event) {
    setIsProfileEdited(true) ;
    const { name, value } = event.target;
    setUser(prevValue => {
      return {
        ...prevValue,
        [name]: value
      }
    });
  }

  function handleAlertClose(){
    setAlert(prevValues => {
      return { ...prevValues, open : false }
    })
  }

  const Edit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token')
    const response = await fetch("http://localhost:5000/auth/editProfile", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization : `Bearer ${token}`
        },
        body: JSON.stringify({ user : user, oldEmail : oldUser.oldEmail , oldUserName : oldUser.oldUserName}),
    });
    const json = await response.json();
    if (!json.success) {
      setAlert(prevValues => { 
        return { ...prevValues, open : true , severity : "error" , message : json.message }
      })
    } else {
        localStorage.setItem('token', json.token);
        if(isProfileEdited){
          setAlert(prevValues => { 
            return { ...prevValues, open : true , severity : "success" , message : "Changes made to Profile" }
          })
          window.removeEventListener('beforeunload', beforeUnload);
          setIsProfileEdited(false);
        }
    }
};

  return (

    <div>
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert severity={alert.severity} onClick={handleAlertClose}>
          {alert.message}
        </Alert>
      </Snackbar> 
      <Navbar />
      <div className="container">
        <div className="cell-container1">
          <h1 className='profile-heading'>Hi! {user.UserName}</h1>
          <div>
            <Link to="/followers" className='d-inline follower-link'>Followers: {user.followers}</Link>
            <Link to="/following" className='d-inline following-link'>Following: {user.following}</Link>
          </div>
          {oldUser.editMode ? <EditForm Edit={Edit} modify={modify} Cancel={ViewMode} userDetails={user} oldDetails={oldUser} button={!user.UserName || !user.Email}/> :
            <div className="row g-3">
              <div>FirstName: {user.FirstName}</div>
              <div>LastName: {user.LastName}</div>
              <div>UserName: {user.UserName}</div>
              <div>Email: {user.Email}</div>
              <div>Age: {user.Age}</div>
              <div>PhoneNumber: {user.PhoneNumber}</div>
              <div className='profile-btn'><button className="btn btn-lg btn-outline-success btn-opacity col-md-6" onClick={EditMode}>Edit</button></div>
            </div>
          }
        </div>
        <div className="cell-container2 image-tilt">
          <img src="img1.png" alt="IMG" />
        </div>
      </div>
    </div>

  )
}

export default Profile;
