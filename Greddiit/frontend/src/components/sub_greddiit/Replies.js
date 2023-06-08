import React from 'react'
import jwtDecode from "jwt-decode";

const Replies = (props) => {
    const UserName = jwtDecode(localStorage.getItem("token")).UserName;
    const [comments, setComments] = React.useState([]);
    const [newCommentText, setNewCommentText] = React.useState('');

    React.useEffect(() => {
        setComments(props.Comments);
    }, []);

    const handleNewCommentSubmit = async(e) => {
        e.preventDefault();
        const NewComment = {
            Text : newCommentText,
            PostedBy : UserName ,
            PostedIn : new Date()
        }
        const response = await fetch("http://localhost:5000/sub-greddiit/"+ props.ID + "/" + props.Details._id +"/NewComment",{
            method:"POST",
            headers : {
            'Content-Type' : "application/json"
            },
            body: JSON.stringify({comment : NewComment})
        })
        const json = await response.json();
        if(!json.success){
            console.log(json.message);
        } else {
            setComments(prevComments => {
            return [...prevComments, NewComment]
            });
            setNewCommentText("")
        }
    }

    function renderComment(comment) {
        return (
                <div>
                {comment.PostedBy + ":  " +comment.Text}
                {/* <Button onClick={() => <Reply />}>Reply</Button> */}
                </div>
        );
    }  

  return (
    <div>
        {"Comments: "}
        {comments.map((comment,index) => <div key={index}>{renderComment(comment)}</div>)}
        <form onSubmit={handleNewCommentSubmit}>
          <input type="text" value={newCommentText} onChange={e => {setNewCommentText(e.target.value)}} />
          <button type="submit">Comment</button>
        </form>
    </div>
  )
}

export default Replies