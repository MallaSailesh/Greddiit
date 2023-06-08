import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import jwtDecode from "jwt-decode";
import LoadingButton from '@mui/lab/LoadingButton';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Modal from "@mui/material/Modal";
import PostAddIcon from '@mui/icons-material/PostAdd';
import { red } from "@mui/material/colors";
import React from "react";
import Replies from "./Replies"
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const PostData = (props) => {
    const UserName = jwtDecode(localStorage.getItem("token")).UserName;
    const [Color, setColor] = React.useState({
        upVote: false,
        upVoteCnt : 0 ,
        downVote: false,
        downVoteCnt : 0 ,
        savePost: false,
        reportPost: false ,
        Follow : false ,
    });
    const [page, setPage] = React.useState({
      Open : false ,
      Concern : "",
      loading : false
    });

    React.useEffect(() => {
        async function getData(postId) {
          const token = localStorage.getItem("token");
          const response = await fetch("http://localhost:5000/sub-greddiit/" +
              props.ID + "/" + postId + "/status",
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
                savePost : json.savepost,
                upVote: props.Details.Upvotes.includes(UserName),
                upVoteCnt : props.Details.Upvotes.length,
                downVote : props.Details.Downvotes.includes(UserName),
                downVoteCnt: props.Details.Downvotes.length,
                Follow: json.follow,
                reportPost : json.report
              };
            });
          }
        }
        getData(props.Details._id)
      }, []);

    const UpVote = async (postId) => {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/sub-greddiit/" +
            props.ID +
            "/" +
            postId +
            "/upvote",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body:JSON.stringify({upvote : Color.upVote})
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
   
   const DownVote = async (postId) => {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/sub-greddiit/" +
            props.ID + "/" + postId + "/downvote",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body:JSON.stringify({downvote : Color.downVote})
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

   const SavePost = async (postId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://localhost:5000/sub-greddiit/" +
        props.ID +
        "/" +
        postId +
        "/savepost",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify({savepost : Color.savePost})
      }
    );
    const json = await response.json();
    if (!json.success) {
      alert(json.message);
    } else {
      setColor((prevValues) => {
        return {
          ...prevValues,
          savePost : !Color.savePost
        };
      });
    }
   };

  const handleFollow = async(e) => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/follower/follow",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify({follow : e.target.getAttribute('name')})
    });
    const json = await response.json();
    if (!json.success) {
      alert(json.message);
    } else {
      window.location.reload();
    }
  }

  const ReportPost = async(Details) => {
    setPage(prevValues => {
      return {
        ...prevValues,
        loading : true 
      }
    })
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://localhost:5000/sub-greddiit/" +
        props.ID +
        "/" +
        Details._id +
        "/report",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify({Details : Details, Concern : page.Concern})
      }
    );
    const json = await response.json();
    handleClose();
    console.log("Must Work");
    if (!json.success) {
      alert(json.message);
    } else {
      window.location.reload()
    }
   }

  function modify(e){
    e.preventDefault();
    setPage((prevValues) => {
      return {
        ...prevValues,
        Concern: e.target.value,
      };
    });
  }

  function handleOpen() {
    setPage((prevValues) => {
      return {
        ...prevValues,
        Open: true,
      };
    });
  }

  function handleClose() {
    setPage((prevValues) => {
      return {
        ...prevValues,
        Open: false,
        Concern: "",
      };
    });
  }
  

  return (
    <div>
      <Card>
        <CardHeader
          avatar={
            !props.Blocked.includes(props.Details.PostedBy) ?
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              {props.Details.PostedBy && props.Details.PostedBy[0].toUpperCase()}
            </Avatar> : 
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              {}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={!props.Blocked.includes(props.Details.PostedBy) ? props.Details.PostedBy:  "Blocked User"}
          subheader={props.Details.PostedIn}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {props.Details.Text}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton onClick={() => UpVote(props.Details._id)} aria-label="UpVote">
            {Color.upVoteCnt}
            <ThumbUpIcon color={Color.upVote ? "success" : ""} />
          </IconButton>
          <IconButton onClick={() => DownVote(props.Details._id)} aria-label="DownVote">
            {Color.downVoteCnt}
            <ThumbDownIcon color={Color.downVote ? "error" : ""}/>
          </IconButton >
          {
            Color.reportPost ? 
            <IconButton  onClick={handleOpen} aria-label="Report" disabled>
              <ReportProblemIcon color="error"/>
            </IconButton>
            :
            <IconButton  onClick={handleOpen} aria-label="Report" >
              <ReportProblemIcon/>
            </IconButton>
          }
          <Modal
              open={page.Open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  ReportPost
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <label>Concern</label>
                  <input type="text" onChange={modify} />
                  <LoadingButton
                        onClick={() => ReportPost(props.Details)}
                        loading={page.loading}
                        loadingIndicator="Loading…"
                        variant="outlined"
                        disabled={!page.Concern}
                      >
                        <span>Report</span>
                  </LoadingButton>
                  <button onClick={handleClose}> Close </button>
                </Typography>
              </Box>
            </Modal>
          <IconButton onClick={() => SavePost(props.Details._id)} aria-label="SavePost">
            <PostAddIcon color={Color.savePost ? "primary" : ""}/>
          </IconButton>
          <Button onClick={handleFollow} name={props.Details.PostedBy} disabled={Color.Follow}>{Color.Follow ? "Following" : "Follow"}</Button>
        </CardActions>
        <Replies ID={props.ID} Detials={props.Details} Comments={props.Details.Comments}/>
      </Card>
    </div>
  );
};

export default PostData;
