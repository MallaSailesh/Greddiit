import ChatIcon from '@mui/icons-material/Chat';
import DeleteIcon from '@mui/icons-material/Delete';
import jwtDecode from 'jwt-decode';
import React from "react";
import { useNavigate } from 'react-router';

function UserFollower(props) {

    const navigate = useNavigate() ;
    const UserName = jwtDecode(localStorage.getItem('token')).UserName ;

    function Unfollow(){

        const unfollow = async() => {
            const response = await fetch("http://localhost:5000/follower/unfollow",{
                method : "DELETE",
                headers : {
                    'Content-Type' : "application/json",
                },
                body : JSON.stringify({id : props.id})
            });

            const json = await response.json();
            if(!json.success){
                alert(json.message);
            } 
        }
        unfollow();
        {props.unfollow(props.id)}
    }

    const Chatting = async() => {
        const response = await fetch("http://localhost:5000/chat/"+props.UserName , {
          method : "POST",
          headers : {
            'Content-Type' : "application/json",
          },
          body : JSON.stringify({me : UserName})
        });

        const json = await response.json();
        if(!json.success){
            alert(json.message);
        } else {
            navigate("/chat/"+props.UserName);
        }
    }

    return (
        <div className="followers">
            <p className="d-inline">{props.UserName}</p>
            <button className="btn btn-lg" onClick={Unfollow}>
                <DeleteIcon />
                <span>Remove</span>
            </button>
            <button className="btn btn-lg" onClick={Chatting}>
                <ChatIcon />
                <span>Chat</span>
            </button>
        </div>
    );
}

export default UserFollower ;
