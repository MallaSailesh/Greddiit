import React from "react";
import Grid from "@mui/material/Grid";
import Post from "./Post"
import Navbar from "../Navbar"

const AllSavedPosts = () => {
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    async function fetchData() {
      const response = await fetch("http://localhost:5000/savedPosts/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();
      if (!json.success) {
        alert(json.message);
      } else {
        setPosts(json.data);
      }
    }
    fetchData();
  }, []);

  function RemovePost(postId){
    setPosts(prevValues => {
      return prevValues.filter((Post) => postId !== Post)
    })
  }

  return (
    <div>
      <Navbar />
      <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {posts.map((post) => {
          return (
            <Grid m={2} item xs={3} key={post}>
              <Post Details={post} RemoveSavedPost={RemovePost}/>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default AllSavedPosts;
