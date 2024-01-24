# Greddiit
***A website similar to reddit***

Skills :- 
 - MERN Stack (Mongodb, express.js, react.js, node.js)

From directory Greddiit:- 
- cd frontend then npm i 
- cd backend then npm i
- Then from directory frontend npm start

The functionalities which included in this are :- 
- Can login the website using a emaild and password (jwt, and password is hashed etc saftey details are involved) or using google .
- If input is invalid the ubtton gets disabled. 
- You can create as many as sub-greddiit :- 
      1. Name of the Subgreddit
      2. Tags
      3. Banned Key Words
- There will be a page where we can find all the Sub Greddiit in order :-
      1. Sub Greddiits created by that user.
      2. Sub Greddiits for which he is a member.
      3. Other Sub Greddiit.
- Search Option is also there for searching Sub Greddiit (It involves fuzzy search which means even if the name we want to search is not typed exactly then the results appear).
- For the other Sub Greddiit we have an option to send an invite to the owner of the Sub Greddiit .
- The owner then gets an option to accept my request or decline the request .
- If declined then he is banned for inviting again for a while .
- The owner can see all the users of the Sub Greddiit.
- Sub Greddiit invloves uploading a **image** while creating . 
- owner can also see graphs of people joined vs days (i.e on this day these many joined ) , posts vs day etc
- The owner can see all the reported Posts -
      1. Then he can block the user . Then he can cancel in 3 seconds if wanted . If blocked then the user name is appeared as Blocked user for all other suers
      2. (or) He can delete the post .
      3. (or) He can ignore which gets removed after say 7 days . 
- In Sub Greddiit any user can post the posts.
- So for that Post :- 
      1. We can Like / Dislike a Post (Both cant be done)
      2. Report a Post by telling the reason .
      3. Save a post
      4. If there is a banned key word in the post then *** appears in those places fo the post. 
      5. It involves loading say 15 posts , on scrolling further next 15 posts gets loaded .
      6. Date fo the Post and Posted By information is also there.
- Deletion of  subgreddiit is also allowed
- We can also follow a user and other users can also follow us .
- If both are following each other then they can also **chat**.
- Changing our details is also allowed. (Email must be unique)
- If not clicked on submit when updated our new details then a pop up comes saying the details dont gets updated until clicked on submit. (Cancel and Proceed Options available)
  etc


***Note - there are few env variables which were inside backend env/app.js and backend/middleware/auth.js. Look at it .***
