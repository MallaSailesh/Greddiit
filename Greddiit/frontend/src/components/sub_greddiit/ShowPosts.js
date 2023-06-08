import Avatar from "@mui/material/Avatar";
import Alert from '@mui/material/Alert';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import LoadingButton from '@mui/lab/LoadingButton';
import Modal from "@mui/material/Modal";
import PostData from "./PostData";
import React from "react";
import Snackbar  from "@mui/material/Snackbar";
import TextField from '@mui/material/TextField';
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

const ShowPosts = (props) => {
  
  const [modal, setModal] = React.useState({
    text : "",
    open : false,
    loading : false,
  })
  const [alert, setAlert] = React.useState({
    open : false ,
    severity : "success",
    message : ""
  });
  const [Details, setDetails] = React.useState();
  const [Posts, setPosts] = React.useState([])
  let page = 0
  let nextSet = (!props.Details || !props.Details.Posts ?  0 : 
    props.Details.Posts.length%10 === 0 ? Math.floor(props.Details.Posts.length/10) : Math.floor(props.Details.Posts.length/10)+1
  )
  const [loading, setLoading] = React.useState(false);
  let checkLoading = false
  
  function handleScroll() {
      const bottom = Math.ceil(window.innerHeight + window.pageYOffset) >= document.documentElement.scrollHeight;
      if (bottom && !checkLoading) {
          setTimeout(() => {
              fetchData()
          }, 1500);
          checkLoading = true 
          setLoading(true)
      }
  }

  const fetchData = async() => {
    setLoading(true)
    const response = await fetch("http://localhost:5000/sub-greddiit/"+props.Details._id+"/getPosts"+`?page=${page}&limit=10`,{
      method : "GET",
      headers : {
        "Content-Type" : "application/json",
      }
    });
    if(page === nextSet-1) window.removeEventListener('scroll',handleScroll);
    page = (page + 1)%nextSet ;
    const json = await response.json();
    if(!json.success){
      alert(json.message);
    } else { 
      setPosts((prevValues) =>  {
        return [...prevValues, ...json.Posts];
      }) ;
      setDetails(props.Details);                                                  
      setLoading(false);
      checkLoading = false 
    }
  }


  React.useEffect(() => {
    if(props.Details){
      fetchData(); 
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      }; 
    }
  },[props.Details])


  function handleOpen() {
    setModal((prevValues) => {
      return { ...prevValues, open: true, };
    });
  }

  function handleClose() {
    setModal((prevValues) => {
      return { ...prevValues, open: false, text: "" };
    });
  }
  
  function handleAlertClose(){
    setAlert(prevValues => {
      return { ...prevValues, open : false }
    })
  }

  function modify(e) {
    e.preventDefault();
    setModal( (prevValues) => {
      return { ...prevValues, text : e.target.value }
    } );
  }


  const handleSubmit = async(e) => {
    e.preventDefault();
    setModal(prevValues => {
      return {
        ...prevValues,
        loading : true 
      }
    })
    let modified = false ;
    Details.BannedKeys.forEach((key) => {
      while(modal.text.toLowerCase().includes(key)){
        modified = true
        const index = modal.text.toLowerCase().indexOf(key);
        modal.text = modal.text.substring(0,index) + "***" + modal.text.substring(index + key.length)
      }}
    )

    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/sub-greddiit/"+Details._id+"/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ Text: modal.text }),
    });
    const json = await response.json();
    handleClose();
    if (!json.success) {
      setAlert(prevValues => { 
        return { ...prevValues, open : true , severity : "error" , message : json.message }
      })
    } else {
      if(modified){
        setAlert(prevValues => { 
          return { ...prevValues, open : true , severity : "error" , message : "New Post Added but it has some Banned Keys" }
        })
      } else {
        setAlert(prevValues => { 
          return { ...prevValues, open : true , severity : "success" , message : "New Post added" }
        })
      }
      window.location.reload()
    }
    setModal(prevValues => {
      return {
        ...prevValues,
        text : "",
        loading : false 
      }
    })
  };

  return (
    <div>
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert severity={alert.severity} onClick={handleAlertClose}>
          {alert.message}
        </Alert>
      </Snackbar>
      <Box textAlign='right' m={2}> 
        <Button onClick={handleOpen}>New Post</Button> 
      </Box>
      <Modal open={modal.open} onClose={handleClose} >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            New Post
          </Typography>
          <Typography component='span' id="modal-modal-description" sx={{ mt: 2 }}>
            <Box> 
              <TextField label="Text" name="Post" onChange={modify} margin="normal"/>
            </Box>
            <LoadingButton
              onClick={handleSubmit} loading={modal.loading} loadingIndicator="Loading…"
              variant="outlined" disabled={!modal.text.length}
            >
              <span>Create</span>
            </LoadingButton>
            <Button onClick={handleClose}> Close </Button>
          </Typography>
        </Box>
      </Modal> 
      { Posts && Posts.length ? (
        <Grid>
          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item style={{ position: 'fixed', top: 30,left: 10, bottom: 10 }}>
                <Avatar src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfKw2cnMO97X52yMtMIYUQXy-heubQAH_F4oDPZ273cQ&s"} />
                <Typography variant="h5">{Details.Name}</Typography>
                <Typography variant="body2">{Details.Description}</Typography>
            </Grid>
          </Grid>
          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={9} style={{ marginLeft: '23%', marginTop: '64px' }}>
              {Posts.map((post, index) => {;
                return (
                  <Grid m={2} item xs={12} key={index}>
                    <PostData ID={Details._id} Blocked={Details.BlockedUsers} Details={post}/>
                  </Grid>
                );
              })}
              {loading && <p>Loading...</p>}
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <h1>No Posts</h1>
      )}
    </div>
  );
};

export default ShowPosts;
