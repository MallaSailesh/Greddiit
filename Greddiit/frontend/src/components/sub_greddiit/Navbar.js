import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Favorite from '@mui/icons-material/Favorite';
import GroupIcon from '@mui/icons-material/Group';
import Home from "@mui/icons-material/Home"
import jwtDecode from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import Paper from '@mui/material/Paper';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import React from "react";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const bottomNavbar = {
  width: '100%',
  position: 'fixed',
  bottom: 0,
  backgroundColor : "#AAE3E2",
  color: "black"
}

function Navbar(props) {
  const navigate = useNavigate();
  const UserName = jwtDecode(localStorage.getItem("token")).UserName;
  const [value, setValue] = React.useState('Posts');

  const setPage = (event, newValue) => {
    setValue(newValue);
    {props.goto(newValue)}
  };

  return (
      <div>
          {props.Details && props.Details.UserName === UserName &&
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
              <BottomNavigation sx={bottomNavbar} value={value} onChange={setPage} showLabels>
                <BottomNavigationAction label="Posts" value="Posts" icon={<Home />} />
                <BottomNavigationAction label="Users" value="Users" icon={<GroupIcon />} />
                <BottomNavigationAction label="JoiningRequests" value="JoiningRequests"  icon={<Favorite />} />
                <BottomNavigationAction label="Stats" value="Stats"  icon={<QueryStatsIcon />} />
                <BottomNavigationAction label="Reports" value="Reports" icon={<RemoveCircleOutlineIcon />} />
              </BottomNavigation>
            </Paper>
          }
      </div>
  );
}

export default Navbar;
