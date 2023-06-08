import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router";
import jwtDecode from "jwt-decode";

const AllSubGreddiits = (props) => {
  const navigate = useNavigate();
  const Email = jwtDecode(localStorage.getItem("token")).Email;
  
  const ReqJoin = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const details = JSON.parse(e.target.getAttribute("details"));
    const response = await fetch(
      "http://localhost:5000/sub-greddiit/" + details._id + "/request",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(details),
      }
    );
    const json = await response.json();
    if (!json.success) {
      alert(json.message);
    } else {
      window.location.reload();
    }
  };

  function OpenSubGreddiit() {
    navigate(`/sub-greddiit/${props.ASubGreddiit._id}`);
  }

  const LeaveSubGreddiit = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://localhost:5000/sub-greddiit/LeaveSubGreddiit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: props.ASubGreddiit._id }),
      }
    );
    const json = await response.json();
    if (!json.success) {
      alert(json.message);
    } else {
      window.location.reload();
    }
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {props.ASubGreddiit.Name[0].toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={props.ASubGreddiit.Name}
        subheader={props.ASubGreddiit.Description}
      />
      <CardContent>
        <Typography component={"span"} variant="body2" color="text.secondary">
          <p>
            FollowersCnt:
            {props.ASubGreddiit.Followers &&
              props.ASubGreddiit.Followers.length}
          </p>
          <p>
            NumberOfPosts:
            {props.ASubGreddiit.Posts.length}
          </p>
          <p>BannedKeys: {props.ASubGreddiit.BannedKeys.join(", ")}</p>
          <p>Tags: {props.ASubGreddiit.Tags.join(", ")}</p>
          <Box sx={{ "& button": { m: 1 } }}>
            {props.Details === "" &&
            props.ASubGreddiit.Requests.find(obj => obj.Email === Email ) ? (
              <Button
                details={JSON.stringify(props.ASubGreddiit)}
                onClick={ReqJoin}
                variant="outlined"
                color="success"
                disabled={true}
              >
                Requested
              </Button>
            ) : props.Details === "" ? (
              <Button
                details={JSON.stringify(props.ASubGreddiit)}
                onClick={ReqJoin}
                variant="outlined"
                color="success"
              >
                Join
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={OpenSubGreddiit}
                color="success"
              >
                Open
              </Button>
            )}
            <Button
              variant="outlined"
              color="error"
              onClick={LeaveSubGreddiit}
              disabled={props.Details === "moderator" || props.Details === ""}
            >
              Leave
            </Button>
          </Box>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AllSubGreddiits;
