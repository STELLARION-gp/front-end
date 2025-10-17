import React from "react";
import { useParams } from "react-router-dom";
import AuthorProfilePage from "./AuthorProfilePage";
import { authors } from "./authorData"; // You should have an authors array or fetch logic

const AuthorProfilePageWrapper: React.FC = () => {
  const { authorName } = useParams();
  const author = authors.find(a => a.name === decodeURIComponent(authorName || ""));

  if (!author) {
    return <div style={{ color: '#fff', padding: '2rem' }}>Author not found.</div>;
  }

  return <AuthorProfilePage author={author} />;
};

export default AuthorProfilePageWrapper;
