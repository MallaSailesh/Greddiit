import React from "react";
import Grid from "@mui/material/Grid";
import  Typography  from "@mui/material/Typography";
import  Chip  from "@mui/material/Chip";

const Users = (props) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6} >
        <Typography variant="h4">Users</Typography>
        {props.Details.Followers && 
          props.Details.Followers.map((follower, index) => {
            if (!props.Details.BlockedUsers.includes(follower.Name)) {
              return (
                <div key={index}>
                  <Chip label={follower.Name} />
                </div>
              );
            }
          })
        }
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h4">Blocked Users</Typography>
        {props.Details.Followers && 
          props.Details.Followers.map((follower, index) => {
            if (props.Details.BlockedUsers.includes(follower.Name)) {
              return (
                <div key={index}>
                  <Chip label={follower.Name} color="secondary" />
                </div>
              );
            }
          })
        }
      </Grid>
    </Grid>
  );
};

export default Users;
