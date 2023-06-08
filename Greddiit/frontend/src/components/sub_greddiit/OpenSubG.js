import Button from "@mui/material/Button";
import JoiningRequests from "./JoiningRequests";
import Grid from "@mui/material/Grid";
import jwtDecode from "jwt-decode";
import Navbar from "./Navbar";
import React from "react";
import ReportedPage from "./ReportedPage";
import ShowPosts from "./ShowPosts";
import Stats from "./Stats/Stats";
import Typography from "@mui/material/Typography";
import Users from "./Users";
import { useNavigate, useParams } from "react-router-dom";
import NavbarMain from "../Navbar";

function OpenSubG() {
  const navigate = useNavigate();
  const { id } = useParams();
  const UserName = jwtDecode(localStorage.getItem("token")).UserName;
  const token = localStorage.getItem("token");
  const [Details, setDetails] = React.useState({});
  const [info, setInfo] = React.useState({
    location: "Posts"
  });

  async function fetchData() {
    const response = await fetch("http://localhost:5000/sub-greddiit/" + id, {
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
      setDetails(json.data);
    }
  }

  React.useEffect(() => { fetchData() }, []);

  function goTo(place) {
    setInfo((prevValues) => {
      return {
        ...prevValues,
        location: place,
      };
    });
  }


  return (
    <div>
      <NavbarMain />
    {   Details.Followers && Details.Followers.find(obj => obj.Name === UserName) ?
        (
          info.location === "Users" ? (
            <Grid>
              <Grid m={7}>
                <Users Details={Details}/>
              </Grid>
              <Navbar goto={goTo} Details={Details}  />
            </Grid>
          )  :
          info.location === 'Stats' ? (
            <Grid>
              <Grid m={7}>
                <Stats Details={Details}/>
              </Grid>
              <Navbar goto={goTo} Details={Details}/>
            </Grid>
          ) : info.location === "JoiningRequests" ? (
            <Grid>
              <Grid m={7}>
                 <JoiningRequests Details={Details} />
              </Grid>
              <Navbar goto={goTo} Details={Details} />
            </Grid>
          ) : info.location === "Reports" ? (
            <Grid>
              <Grid m={7}>
                <ReportedPage Details={Details}/>
              </Grid>
              <Navbar goto={goTo} Details={Details} />
            </Grid>
          ) : (
            <Grid>
              <Grid m={7}>
               <ShowPosts Details={Details} />
              </Grid>
              <Navbar goto={goTo} Details={Details} />
            </Grid>
          )
        ) : 
        <div style={{ textAlign: 'center', paddingTop: '100px' }}>
          <Typography variant="h3" color="secondary">No Access</Typography>
          <Typography variant="body1" color="textSecondary">Sorry, you don't have permission to view this page. Please contact your administrator if you believe this is an error.</Typography>
          <Button variant="contained" color="success" onClick={ (e) =>  { navigate("/sub-greddiit")} } >Go Back Home</Button>
        </div>
    }
    </div> 
  );
}

export default OpenSubG;
