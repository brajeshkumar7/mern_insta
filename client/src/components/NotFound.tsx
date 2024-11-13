import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);
  return (
    <div>
      <h1>404 Not Found</h1>
      <br />
      <p>Sorry, We couldn&apos;t find that page.</p>
      <div>
        <button onClick={goBack}>Back</button>
      </div>
    </div>
  );
};

export default NotFound;
