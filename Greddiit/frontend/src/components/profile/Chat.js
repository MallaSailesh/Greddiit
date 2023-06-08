import React from 'react'
import jwtDecode from "jwt-decode";
import Navbar from "../Navbar"
import SendIcon from '@mui/icons-material/Send';
import { useNavigate, useParams } from 'react-router';
import {
  Container,Grid,TextField,Button,List,ListItem,ListItemText,Typography,
} from "@mui/material";

const Chat = () => {

  const navigate = useNavigate();
  const UserName = jwtDecode(localStorage.getItem('token')).UserName  
  const {other} = useParams();
  const [chats, setChats] = React.useState([])
  const [message, setMessage] = React.useState("");
  const messagesEndRef = React.useRef(null);

  
  React.useEffect(() => {
    async function fetchData()  {
      const response = await fetch("http://localhost:5000/chat/"+other+"/getData" , {
        method : "POST",
        headers : {
          'Content-Type' : "application/json",
        },
          body : JSON.stringify({me : UserName})
      });
        
        const json = await response.json();
        if(!json.success){
          alert(json.message);
          navigate("/profile")
        } else {
          setChats(json.chats);
        }
      } 
      fetchData();
    },[]);

    React.useEffect(() => {
      scrollToBottom();
    }, [chats]);
    
    const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const submitChat = async(e) => {
    e.preventDefault()
    const response = await fetch("http://localhost:5000/chat/"+other+"/submitData" , {
        method : "POST",
        headers : {
          'Content-Type' : "application/json",
        },
        body : JSON.stringify({me : UserName, text : message})
    });
        
    const json = await response.json();
    if(!json.success){
      alert(json.message);
    } else {
      const Person = {
        Message : message ,
        UserName : UserName
      }
      setChats(prevValues => {
        return [ ...prevValues, Person ]
      })
    } 
    setMessage("")
  }

  return (
    <div>
        <Navbar />
        <Container maxWidth="sm">
          <Grid container direction="column" style={{ height: "100%" }}>
            <Grid item>
              <Typography variant="h3" component="h1" align="center">
                Chat
              </Typography>
            </Grid>
            <Grid item style={{ flexGrow: 1 }}>
              <List style={{ overflow: "auto" }}>
                {chats.map((chat,index) => (
                  <ListItem
                    key={index}
                    style={{
                      justifyContent: chat.UserName === UserName ? "flex-end" : "flex-start",
                    }}
                  >
                  <ListItemText
                      primary={`${chat.UserName}: ${chat.Message}`}
                      style={{
                        backgroundColor: chat.UserName === UserName ? "#dcedc8" : "#e0e0e0",
                        borderRadius: "10px",
                        padding: "10px",
                        maxWidth: "80%",
                      }}
                    />
                  </ListItem>
                ))}
                <div ref={messagesEndRef} />
              </List>
            </Grid>
            <Grid item mb={5}> 
              <form onSubmit={submitChat}>
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={9}>
                    <TextField
                      label="Message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button type="submit" variant="contained" color="primary" endIcon={<SendIcon />} fullWidth>
                      Send
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Container>
    </div>
  )
}

export default Chat