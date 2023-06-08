import React, { useEffect, useState } from "react";
import Registration from "./components/Registration";
import Home from "./components/Home";
import Profile from "./components/profile/Profile";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Follower from "./components/profile/Follower/Followers";
import Following from "./components/profile/Following/Following";
import SubGreddiit from "./components/sub_greddiit/subGreddiit";
import OpenSubG from "./components/sub_greddiit/OpenSubG";
import PageNotFound from "./components/NotFound";
import AllSavedPosts from "./components/savedPosts/AllSavedPosts";
import Chat from "./components/profile/Chat";

function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      {localStorage.getItem("token") && (
        <Route path="/" element={<Navigate replace to="/home" />} />
      )}
      <Route path="/" element={<Registration />} />
      {localStorage.getItem("token") && (
        <Route path="/home" element={<Home />} />
      )}
      <Route path="/home" element={<Navigate replace to="/" />} />
      {localStorage.getItem("token") && (
        <Route path="/profile" element={<Profile />} />
      )}
      <Route path="/profile" element={<Navigate replace to="/" />} />
      <Route path="/followers" element={<Follower />} />
      <Route path="/following" element={<Following />} />
      {localStorage.getItem("token") && (
        <Route path="/chat/:other" element={<Chat />} />
      )}
      <Route path="/chat/:other" element={<Navigate replace to="/" />} />
      {localStorage.getItem("token") && (
        <Route path="/sub-greddiit" element={<SubGreddiit />} />
      )}
      <Route path="/sub-greddiit" element={<Navigate replace to="/" />} />
      {localStorage.getItem("token") && (
        <Route path="/sub-greddiit/:id" element={<OpenSubG />} />
      )}
      <Route path="/sub-greddiit/:id" element={<Navigate replace to="/" />} />
      {localStorage.getItem("token") && (
        <Route path="/savedPosts" element={<AllSavedPosts />} />
      )}
      <Route path="/savedPosts" element={<Navigate replace to="/" />} />
      <Route path="*" element={<PageNotFound />}  /> 
    </Routes>
  );
}
export default App;
