import AllSubGreddiits from "./AllSubGreddiits"
import Button  from "@mui/material/Button";
import Box from "@mui/material/Box"
import Fuse from "fuse.js"
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import jwtDecode from "jwt-decode"
import Navbar from "./Navbar";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import {List, ListSubheader, ListItem, ListItemButton, Checkbox, ListItemText, ListItemIcon}  from "@mui/material";
import { useNavigate } from "react-router";
import TextField from "@mui/material/TextField";

function Home() {
  const navigate = useNavigate();    
  const UserName = jwtDecode(localStorage.getItem('token')).UserName
  const [searchQuery,setSearchQuery] = React.useState({
    sort : false,
    query : "",
    SubGreddiits : [],
    data : []
  })
  React.useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/sub-greddiit/AllSubGreddiits",
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
        setSearchQuery(prevValues => {
          return {
            ...prevValues,
            SubGreddiits : json.data,
            data : json.data
          }
        });
      }
    }
    fetchData();
  }, []);

  
  function handleChange(e){
    e.preventDefault()
    const query = e.target.value.toLowerCase();
    const options = {
      keys: ['Name'],
      threshold: 0.5, // or any other value that works for your use case
    };
    const fuse = new Fuse(searchQuery.SubGreddiits, options);
    const results = query ? fuse.search(query).map(result => result.item) : searchQuery.SubGreddiits;
    setSearchQuery(prevValues =>  {
      return {
        ...prevValues,
        sort : false ,
        query : e.target.value  ,
        data : results
        // data : searchQuery.SubGreddiits.filter((data) => data.Name.toLowerCase().includes(e.target.value.toLowerCase())) 
      }
    })
  }
  function sort_names(e){
    e.preventDefault();
    const result = searchQuery.data.sort((a, b) => (a.Name > b.Name ? 1 : -1));
    setSearchQuery(prevValues => {
      return {
        ...prevValues,
        data : result
      }
    });
  }
  function sort_followers(e){
    e.preventDefault();
    const result = searchQuery.data.sort((a,b) => (a.Followers.length < b.Followers.length) ? 1 : -1 );
    setSearchQuery(prevValues => {
      return {
        ...prevValues,
        data : result
      }
    });
  }
  function sort_date(e){
    e.preventDefault();
    const result = searchQuery.data.sort((a,b) => (a.Date < b.Date) ? 1 : -1 );
    setSearchQuery(prevValues => {
      return {
        ...prevValues,
        data : result
      }
    });
  }

  return (
    <div>
      <Navbar />

      <form>
        <TextField
          id="search-bar"
          className="text"
          onInput={handleChange}
          label="Search..."
          variant="outlined"
          placeholder="Search..."
          size="small"
          autoComplete='off'
          value = {searchQuery.query}
        />
        <IconButton aria-label="search">
          <SearchIcon style={{ fill: "blue" }} />
        </IconButton>
      </form>

      <Box sx={{ "& button": { m: 1 } }}>
        <Button onClick={sort_names} variant="outlined" color="primary">SortByNames</Button>
        <Button onClick={sort_followers} variant="outlined" color="primary">SortByFollowersCnt</Button>
        <Button onClick={sort_date} variant="outlined" color="primary">SortByCreationDate</Button>
      </Box>

      <Grid container  columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      {
        searchQuery.data.map((ASubGreddiit,index) => {
          if (ASubGreddiit.UserName === UserName){
            return (
              <Grid m={2} item xs={3} key={index}>
                <AllSubGreddiits Details="moderator" ASubGreddiit={ASubGreddiit} />
              </Grid>
            );
          } 
        })
      }
      </Grid>

      <Grid container  columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      {
        searchQuery.data.map((ASubGreddiit,index) => {
          if (ASubGreddiit.UserName !== UserName &&  ASubGreddiit.Followers.find( obj =>  obj.Name === UserName)){
            return (
              <Grid m={2} item xs={3} key={index}>
                <AllSubGreddiits Details="member" ASubGreddiit={ASubGreddiit} />
              </Grid>
            );
          } 
        })
      }
      </Grid>

      <Grid container  columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      {
        searchQuery.data.map((ASubGreddiit,index) => {
          if (ASubGreddiit.UserName !== UserName &&  !ASubGreddiit.Followers.find( obj =>  obj.Name === UserName)){
            return (
              <Grid m={2} item xs={3} key={index}>
                <AllSubGreddiits Details="" ASubGreddiit={ASubGreddiit} />
              </Grid>
            );
          } 
        })
      }
      </Grid>

    </div>
  );
}

export default Home;
