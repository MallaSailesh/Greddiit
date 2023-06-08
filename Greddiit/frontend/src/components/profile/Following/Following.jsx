import Navbar from "../../Navbar"
import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserFollowing from "./userFollowing";

function Following() {
  const navigate = useNavigate();
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/follower/following", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await response.json();
      if (!json.success) {
        alert(json.message);
      } else {
        setFollowing(json.data);
      }
    }
    fetchData();
  }, []);

  function unfollow(id) {
    setFollowing((prevFollowing) => {
      return prevFollowing.filter((following) => following._id !== id);
    });
  }

  return (
    <div>
      <Navbar />
      {following.map((following) => {
        return (
          <UserFollowing
            key={following._id}
            id={following._id}
            unfollow={unfollow}
            UserName={following.following}
          />
        );
      })}
    </div>
  );
}

export default Following;
