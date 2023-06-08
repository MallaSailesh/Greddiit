import AddIcon from "@mui/icons-material/Add";
import Alert from '@mui/material/Alert';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from '@mui/material/Chip';
import Display from "./displaySubG";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import jwtDecode from "jwt-decode";
import LoadingButton from '@mui/lab/LoadingButton';
import Modal from "@mui/material/Modal";
import Navbar from "../Navbar";
import React from "react";
import Snackbar  from "@mui/material/Snackbar";
import TextField from '@mui/material/TextField';
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

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

function SubGreddiit() {
  const navigate = useNavigate();
  const UserName = jwtDecode(localStorage.getItem('token')).UserName
  const [alert, setAlert] = React.useState({
    open : false ,
    severity : "success",
    message : ""
  });
  const [SubGreddiits, setSubGreddiits] = React.useState([]);
  const [SubGreddiit, setSubGreddiit] = React.useState({
    Name: "",
    Description: "",
    Tag: "",
    BannedKey: "",
    Tags: [],
    BannedKeys: [],
    Open: false,
    loading : false
  });

  React.useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/sub-greddiit/MySubGreddiits",
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
        setSubGreddiits(json.data);
      }
    }
    fetchData();
  }, []);

  const handleOpen = () => {
    setSubGreddiit((prevValues) => {
      return { ...prevValues,Open: true };
    });
  };
  const handleClose = () => {
    setSubGreddiit((prevValues) => {
      return{
        ...prevValues,
        Name: "",
        Description: "",
        Tag: "",
        BannedKey: "",
        Tags: [],
        BannedKeys: [],
        Open : false
      }
    });
  };

  function modify(e) {
    setSubGreddiit((prevValues) => {
      return {
        ...prevValues,
        [e.target.name]: e.target.value,
      };
    });
  }
  
  function modify2(e){
    const value = e.target.value.split(" ").join(""); 
    setSubGreddiit((prevValues) => {
      return {
        ...prevValues,
        [e.target.name]: value.toLowerCase(),
      };
    });
  }

  function handleTag(e) {
    e.preventDefault();
    const value = SubGreddiit.Tag;
    setSubGreddiit((prevValues) => {
      return {
        ...prevValues,
        Tag: "",
        Tags: [...prevValues.Tags, value],
      };
    });
  }

  function handleBannedKey(e) {
    e.preventDefault();
    const value = SubGreddiit.BannedKey;
    setSubGreddiit((prevValues) => {
      return {
        ...prevValues,
        BannedKey: "",
        BannedKeys: [...prevValues.BannedKeys, value],
      };
    });
  }

  function handleDeleteTag(id){
    setSubGreddiit((prevValues) => {
      return { ...prevValues, Tags : prevValues.Tags.filter((_,index) => id !== index) }
    })
  }

  function handleDeleteBannedKey(id){
    setSubGreddiit((prevValues) => {
      return { ...prevValues, BannedKeys : prevValues.BannedKeys.filter((_,index) => id !== index) }
    })
  }

  function handleAlertClose(){
    setAlert(prevValues => {
      return { ...prevValues, open : false }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubGreddiit(prevValues => {
      return {
        ...prevValues,
        loading : true 
      }
    })
    
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/sub-greddiit/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        Name : SubGreddiit.Name, 
        Description: SubGreddiit.Description , 
        Tags : SubGreddiit.Tags, 
        BannedKeys : SubGreddiit.BannedKeys} ),
    });

    const json = await response.json();
    if (!json.success) {
      setSubGreddiit(prevValues => {
        return { ...prevValues, Name: "", loading : false }
      })
      setAlert(prevValues => { 
        return { ...prevValues, open : true , severity : "error" , message : json.message }
      })
    } else {
      handleClose();
      setSubGreddiits(prevSubGreddiits => {
        return [json.NewSubGreddiit, ...prevSubGreddiits]
      }) ;
      setSubGreddiit(prevValues => {
        return { ...prevValues, loading : false }
      })
      setAlert(prevValues => { 
        return { ...prevValues, open : true , severity : "success" , message : "New SubGreddiit was Created" }
      })
    }
  };

  function Delete(id) {
    setSubGreddiits((prevValues) => {
      return prevValues.filter((SubGreddiit,index) =>index !== id);
    });
  } 

  return (
    <div>
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert severity={alert.severity} onClick={handleAlertClose}>
          {alert.message}
        </Alert>
      </Snackbar> 
      <Navbar />
      <Button onClick={handleOpen}>Create a New SubGreddiit</Button>
      <Modal open={SubGreddiit.Open} onClose={handleClose} >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create a New SubGreddiit
          </Typography>
          <Typography component={'span'} id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              label="Name" name="Name" value={SubGreddiit.Name} onChange={modify} margin="normal"
            />
            <TextField
              label="Description" name="Description" value={SubGreddiit.Description}
              onChange={modify} margin="normal"
              multiline rows={4}
            />
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {SubGreddiit.Tags.map((tag, index) => (
                <Chip key={index} label={tag} color="primary" variant="outlined"
                  sx={{ marginRight: 1, marginBottom: 1 }}
                  onDelete={() => handleDeleteTag(index)} 
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex' }}>
              <TextField
                label="Add Tags"
                name="Tag"
                onChange={modify2}
                value={SubGreddiit.Tag}
                margin="normal"
              />
              <IconButton onClick={handleTag} sx={{ ml: 1 }}>
                <AddIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {SubGreddiit.BannedKeys.map((bannedkey, index) => (
                <Chip key={index} label={bannedkey} color="primary" variant="outlined"
                  sx={{ marginRight: 1, marginBottom: 1 }}
                  onDelete={() => handleDeleteBannedKey(index)} 
                />
              ))}
            </Box>
            <Box  sx={{ display: 'flex' }}>
              <TextField
                label="Add Banned Key Words"
                name="BannedKey"
                onChange={modify2}
                value={SubGreddiit.BannedKey}
                margin="normal"
              />
              <IconButton onClick={handleBannedKey} sx={{ ml: 1 }}>
                <AddIcon />
              </IconButton>
            </Box>
            <LoadingButton onClick={handleSubmit} loading={SubGreddiit.loading}
                  loadingIndicator="Loading…" variant="outlined"
                  disabled={!SubGreddiit.Name || !SubGreddiit.Description || !SubGreddiit.Tags.length || !SubGreddiit.BannedKeys.length}
            >
                  <span>Submit</span>
            </LoadingButton>
            <Button onClick={handleClose}> Close </Button>
          </Typography>
        </Box>
      </Modal>

      <Grid container>
      {SubGreddiits.map((ASubGreddiit,index) => {
        return (
          <Grid m={2} item xs={2.8} key={index}>
            <Display id={index} SubGreddiitDetails={ASubGreddiit} DeleteIt={Delete} />
          </Grid>
        );
      })}
      </Grid>

    </div>
  );
}

export default SubGreddiit;
