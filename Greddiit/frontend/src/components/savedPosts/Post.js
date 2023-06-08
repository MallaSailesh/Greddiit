import Avatar from "@mui/material/Avatar";
import Button  from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import jwtDecode from "jwt-decode";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from "react";
import { red } from "@mui/material/colors";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Typography from "@mui/material/Typography";

const Post = (props) => {
  const [Color, setColor] = React.useState({
    upVote: false,
    upVoteCnt : 0 ,
    downVote: false,
    downVoteCnt : 0 ,
    Follow: false,
  });
  const [Details, setDetails] = React.useState({
    SubGreddiit: "",
    Post: "",
  });
  const UserName = jwtDecode(localStorage.getItem('token')).UserName

  React.useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token')
      const response = await fetch("http://localhost:5000/savedPosts/getPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization : `Bearer ${token}`
        },
        body: JSON.stringify({ postId: props.Details }),
      });
      const json = await response.json();
      if (!json.success) {
        alert(json.message);
      } else {
        setDetails({
          Post: json.data,
          SubGreddiit: json.SubGreddiit,
        });
      }
    }
    fetchData();
  }, []);

  const RemovePost = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://localhost:5000/savedPosts/deletePost",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId: Details.Post._id }),
      }
    );
    const json = await response.json();
    if (!json.success) {
      alert(json.message);
    } else {
      {
        props.RemoveSavedPost(Details.Post._id);
      }
    }
  };

  React.useEffect(() => {
    async function getData() {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/sub-greddiit/" +
          Details.SubGreddiit._id +
          "/" +
          Details.Post._id +
          "/status",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await response.json();
      if (!json.success) {
        alert(json.message);
      } else {
        setColor((prevValues) => {
          return {
            ...prevValues,
            upVote: Details.Post.Upvotes.includes(UserName),
            upVoteCnt : Details.Post.Upvotes.length,
            downVote: Details.Post.Downvotes.includes(UserName),
            downVoteCnt : Details.Post.Downvotes.length,
            Follow: json.follow,
          };
        });
      }
    }
    if(Details.Post)
    getData();
  }, [Details]);

  const UpVote = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://localhost:5000/sub-greddiit/" +
        Details.SubGreddiit._id +
        "/" +
        Details.Post._id +
        "/upvote",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ upvote: Color.upVote }),
      }
    );
    const json = await response.json();
    let val = Color.upVote ? -1 : 1
    let val2 = Color.downVote ? 1 : 0
    if (!json.success) {
      alert(json.message);
    } else {
      setColor((prevValues) => {
        return {
          ...prevValues,
          upVote: !Color.upVote,
          upVoteCnt : Color.upVoteCnt + val,
          downVoteCnt : Color.downVoteCnt - val2 ,
          downVote : false ,
        };
      });
    }
  };

  const DownVote = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://localhost:5000/sub-greddiit/" +
        Details.SubGreddiit._id +
        "/" +
        Details.Post._id +
        "/downvote",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ downvote: Color.downVote }),
      }
    );
    const json = await response.json();
    let val = Color.downVote ? -1 : 1;
    let val2 = Color.upVote ? 1 : 0 
    if (!json.success) {
      alert(json.message);
    } else {
      setColor((prevValues) => {
        return {
          ...prevValues,
          downVote: !Color.downVote,
          upVote : false, 
          downVoteCnt : Color.downVoteCnt + val,
          upVoteCnt : Color.upVoteCnt - val2,
        };
      });
    }
  };

  const handleFollow = async (e) => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/follower/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ follow: e.target.getAttribute("name") }),
    });
    const json = await response.json();
    if (!json.success) {
      alert(json.message);
    } else {
      window.location.reload();
    }
  };

  return (
    <div>
      {  Details.SubGreddiit && Details.Post && 
        <Card>
          <CardHeader
            avatar={
              Details.Post.PostedBy  && !Details.SubGreddiit.BlockedUsers.includes(Details.Post.PostedBy) ?
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                { Details.Post.PostedBy[0].toUpperCase() }
              </Avatar>
              :
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                {}
              </Avatar>
            }
            action={  
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={Details.Post.PostedBy  && !Details.SubGreddiit.BlockedUsers.includes(Details.Post.PostedBy) ? Details.Post.PostedBy : "Blocked User"}
            subheader={Details.Post.PostedIn}
          />
          <CardContent>
            <Typography component={"span"} variant="body2" color="text.secondary">
              <p>
                This Post is from <b>{Details.SubGreddiit.Name}</b> SubGreddiit
              </p>
              <p>{Details.Post.Text}</p>
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton onClick={() => UpVote()} aria-label="UpVote">
              {Color.upVoteCnt}
              <ThumbUpIcon color={Color.upVote ? "success" : ""} />
            </IconButton>
            <IconButton onClick={() => DownVote()} aria-label="DownVote">
              {Color.downVoteCnt}
              <ThumbDownIcon color={Color.downVote ? "error" : ""}/>
            </IconButton >
            <Button onClick={handleFollow} name={props.Details.PostedBy} disabled={Color.Follow}>{Color.Follow ? "Following" : "Follow"}</Button>
            <IconButton onClick={() => RemovePost()} aria-label="RemovePost">
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
      }
    </div>
  );
};

export default Post;
