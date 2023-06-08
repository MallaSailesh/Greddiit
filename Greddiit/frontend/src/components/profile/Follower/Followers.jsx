import Navbar from "../../Navbar"
import { React, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import UserFollower from './userFollower';

function Follower() {

    const navigate = useNavigate();
    const [followers, setFollowers] = useState([]);

    useEffect(() => {

        async function fetchData() {
            const token = localStorage.getItem('token');
            const response = await fetch("http://localhost:5000/follower/followers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            const json = await response.json();
            if (!json.success) {
                alert(json.message);
            } else {
                setFollowers(json.data);
            }
        }
        fetchData();
    }, []);

    function unfollow(id) {
        // console.log(id);
        setFollowers(prevFollowers => {
            return prevFollowers.filter( (follower) => follower._id !== id );
        })
    }

    return (
        <div>
            <Navbar />
            {followers.map(follower => {
                  return (
                    <UserFollower key={follower._id} id={follower._id} unfollow={unfollow} UserName={follower.follower}/>
                  );
            })}
        </div>
    );
}

export default Follower;

