import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const JoiningRequests = (props) => {
  const [Requests, setRequests] = React.useState([]);

  React.useEffect(() => {
    setRequests(props.Details.Requests);
  }, []);

  const removeUser = async (e) => {
    e.preventDefault();
    const userDetails = JSON.parse(e.target.getAttribute("details"));
    const response = await fetch(
      "http://localhost:5000/sub-greddiit/" +
        props.Details._id +
        "/request/reject",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      }
    );

    const json = await response.json();
    if (!json.success) {
      alert(json.message);
    } else {
      setRequests((prevValues) => {
        return prevValues.filter((User) => User._id !== userDetails._id);
      });
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    const userDetails = JSON.parse(e.target.getAttribute("details"));
    const response = await fetch(
      "http://localhost:5000/sub-greddiit/" +
        props.Details._id + "/request/accept",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      }
    );

    const json = await response.json();
    if (!json.success) {
      alert(json.message);
    } else {
      setRequests((prevValues) => {
        return prevValues.filter((User) => User._id !== userDetails._id);
      });
    }
  };

  return (
    <div>
      {Requests && Requests.length ? (
        Requests.map((request, index) => {
          return (
            <Box sx={{ "& button": { m: 1 } }} key={index}>
              <Button variant="text">{request.UserName}</Button>
              <Button
                variant="contained"
                color="success"
                details={JSON.stringify(request)}
                onClick={addUser}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="error"
                details={JSON.stringify(request)}
                onClick={removeUser}
              >
                Reject
              </Button>
            </Box>
          );
        })
      ) : (
        <h1>No Requests</h1>
      )}
    </div>
  );
};

export default JoiningRequests;
