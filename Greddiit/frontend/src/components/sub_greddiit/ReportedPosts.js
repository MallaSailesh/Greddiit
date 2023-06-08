import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Button } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';

const ReportedPosts = (props) => {
  const time = 10 * 24 * 60 * 60 * 1000; // 10 days
  const [requirements, setRequirements] = React.useState({
    ignore: false,
    Time: 0,
    Cancel: true,
    loading : false
  });
  let timeoutId;

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    async function fetchData() {
      const response = await fetch(
        "http://localhost:5000/sub-greddiit/" +
          props.ID +"/" +props.Details._id +"/deleteReport",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            time: time,
            UserName: props.Details.ReportedOn,
            CreatedDate: props.Details.ReportedDate,
          }),
        }
      );
      const json = await response.json();
      if (!json.success) {
        alert(json.message);
      } else {
        setRequirements((prevValues) => {
          return {
            ...prevValues,
            ignore: json.ignore,
            Cancel: json.cancel,
          };
        });
      }
    }
    fetchData();
  }, []);

  React.useEffect(() => {
    if (requirements.Time > 0) {
      timeoutId = setTimeout(() => {
        setRequirements((prevValues) => {
          return { ...prevValues, Time: requirements.Time - 1 };
        });
      }, 1000);
      console.log(requirements.Time + " seconds Left");
    } else if (requirements.Cancel === false) {
      async function fetchData() {
        const response = await fetch(
          "http://localhost:5000/sub-greddiit/" + props.ID + "/blockUser",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Details: props.Details,
            }),
          }
        );
        const json = await response.json();
        if (!json.success) {
          alert(json.message);
        }
      }
      fetchData();
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [requirements]);

  function BlockUser() {
    setRequirements((prevValues) => {
      return { ...prevValues, Cancel: false, Time: 3 };
    });
  }

  function CancelBlock() {
    clearTimeout(timeoutId);
    setRequirements((prevValues) => {
      return { ...prevValues, Cancel: true, Time: 0 };
    });
  }

  const Ignore = async () => {
    const response = await fetch(
      "http://localhost:5000/sub-greddiit/" +
        props.ID +
        "/" +
        props.Details._id +
        "/ignoreReport",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ignore: requirements.ignore }),
      }
    );
    const json = await response.json();
    if (!json.success) {
      alert(json.message);
    } else {
      setRequirements((prevValues) => {
        return {
          ...prevValues,
          ignore: !requirements.ignore,
        };
      });
    }
  };

  const DeletePost = async () => {
    setRequirements(prevValues => {
      return {
        ...prevValues,
        loading : true ,
      }
    })
    const response = await fetch(
      "http://localhost:5000/sub-greddiit/" +
        props.ID +"/" +props.Details.PostId +"/delete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const json = await response.json();
    if (!json.success) {
      alert(json.message);
    } else {
      setRequirements(prevValues => {
        return {
          ...prevValues,
          loading : false ,
        }
      })
      window.location.reload();
      // {props.deletePost(props.Details._id)}
    }
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {props.Details.ReportedBy[0].toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={props.Details.ReportedBy}
        subheader={props.Details.ReportedOn}
      />
      <CardContent>
        <Typography component={"span"} variant="body2" color="text.secondary">
          <p>ReportedBy: {props.Details.ReportedBy}</p>
          <p>ReportedOn: {props.Details.ReportedOn}</p>
          <p>PostText: {props.Details.PostText}</p>
          <p>Concern: {props.Details.Concern}</p>
        </Typography>
      </CardContent>
      {requirements.ignore ? (
        <CardActions disableSpacing>
          <Button disabled>Block User</Button>
          <Button disabled>Delete Post</Button>
          <Button onClick={Ignore}>Consider</Button>
        </CardActions>
      ) : requirements.Time ? (
        <CardActions disableSpacing>
          <Button onClick={CancelBlock}>
            Cancel in {requirements.Time} secs
          </Button>
          <Button disabled>Delete Post</Button>
          <Button disabled>Consider</Button>
        </CardActions>
      ) : !requirements.Cancel ? (
        <CardActions disableSpacing>
          <Button disabled>Blocked</Button>
          <Button disabled>Delete Post</Button>
          <Button disabled>Consider</Button>
        </CardActions>
      ) : (
        <CardActions disableSpacing>
          <LoadingButton
                onClick={BlockUser}
                loading={requirements.loading}
                loadingIndicator="Loading…"
              >
                <span>Block User</span>
          </LoadingButton>
          <LoadingButton
                onClick={DeletePost}
                loading={requirements.loading}
                loadingIndicator="Loading…"
              >
                <span>Delete Post</span>
          </LoadingButton>
          <LoadingButton
                onClick={Ignore}
                loading={requirements.loading}
                loadingIndicator="Loading…"
              >
                <span>Ignore</span>
          </LoadingButton>
        </CardActions>
      )}
    </Card>
  );
};

export default ReportedPosts;
