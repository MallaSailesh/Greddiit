import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from "react";
import { red } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router-dom";

function Display(props) {
  const navigate = useNavigate();

  function DeleteSubGreddiit() {
    const deleteSubGredditt = async () => {
      const response = await fetch("http://localhost:5000/sub-greddiit/delete",{
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: props.SubGreddiitDetails._id }),
        }
      );
      const json = await response.json();
      if (!json.success) {
        alert(json.message);
      }
    };
    deleteSubGredditt();
    { props.DeleteIt(props.id); }
  }

  function OpenSubGreddiit() {
    navigate(`/sub-greddiit/${props.SubGreddiitDetails._id}`);
  }

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {props.SubGreddiitDetails.Name[0].toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={props.SubGreddiitDetails.Name}
        subheader={props.SubGreddiitDetails.Description}
      />
      <CardContent>
        <Typography component={'span'} variant="body2" color="text.secondary">
          <p> FollowersCnt: { props.SubGreddiitDetails.Followers.length } </p>
          <p> NumberOfPosts: {props.SubGreddiitDetails.Posts.length} </p>
          <p>BannedKeys: {props.SubGreddiitDetails.BannedKeys.join(", ")}</p>
          <p>Tags: {props.SubGreddiitDetails.Tags.join(", ")}</p>
          <Box sx={{ "& button": { m: 1 } }}>
            <Button variant="outlined" onClick={OpenSubGreddiit} color="success">
              Open
            </Button>
            <Button variant="outlined" onClick={DeleteSubGreddiit} color="error">
              Delete
            </Button>
          </Box>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Display;
