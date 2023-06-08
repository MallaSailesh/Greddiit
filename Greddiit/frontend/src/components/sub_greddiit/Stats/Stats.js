import Box from "@mui/material/Box"
import NoOfDeletedPosts from "./NoOfDeletedPosts";
import NoOfFollowers from "./NoOfFollowers";
import NoOfPosts from "./NoOfPosts";
import NoOfVisitors from "./NoOfVisitors";
import React from "react";


const Stats = (props) => {

  return (
    <div >
      <Box style={{ display: 'flex', flexDirection: 'row' }} m={2}>
        <NoOfPosts style={{ marginRight: 10 }}  Details={props.Details}/>
        <NoOfFollowers style={{ marginLeft: 10 }}  Details={props.Details}/>
      </Box>
      <Box style={{ display: 'flex', flexDirection: 'row' }} m={2} mt={8}>
        <NoOfVisitors style={{ marginRight: 10 }}  Details={props.Details}/>
        <NoOfDeletedPosts style={{ marginRight: 10 }}  Details={props.Details}/>
      </Box>
    </div>
  );
};

export default Stats;
