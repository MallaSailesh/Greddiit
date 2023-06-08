import ChatIcon from '@mui/icons-material/Chat';
import jwtDecode from 'jwt-decode';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import React from "react";
import { useNavigate } from 'react-router';

function UserFollowing(props) {

    const navigate = useNavigate()
    const UserName = jwtDecode(localStorage.getItem('token')).UserName ;

    function Unfollow() {

        const unfollow = async () => {
            const response = await fetch("http://localhost:5000/follower/unfollow", {
                method: "DELETE",
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify({ id: props.id })
            });

            const json = await response.json();
            if (!json.success) {
                alert(json.message);
            }
        }
        unfollow();

        { props.unfollow(props.id) }
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
                <PersonRemoveIcon />
                <span>Unfollow</span>
            </button>
            <button className="btn btn-lg" onClick={Chatting}>
                <ChatIcon />
                <span>Chat</span>
            </button>
        </div>
    );

}

export default UserFollowing;
