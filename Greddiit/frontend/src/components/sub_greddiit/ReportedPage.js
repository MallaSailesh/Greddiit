import React from 'react'
import ReportedPosts from './ReportedPosts'
import Grid from "@mui/material/Grid";

const ReportedPage = (props) => {

  const [Details,setDetails] = React.useState({});

  React.useEffect(() => {
    setDetails(props.Details)
  },[]) 

  function deletePost(id){
    setDetails(prevValues => {
      let newReports = prevValues.Reports.filter((report) => report._id !== id);
      return {...prevValues, Reports: newReports};
    });
  }

  return (
    <div>
      {Details && Details.Reports && Details.Reports.length ? (
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {Details.Reports.map((report, index) => {
            return (
              <Grid m={2} item xs={3} key={index}>
                <ReportedPosts ID={Details._id} Details={report} deletePost={deletePost}/>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <h1>No Reports</h1>
      )}
    </div>
  )
}

export default ReportedPage