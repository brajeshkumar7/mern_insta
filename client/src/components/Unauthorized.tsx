import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);
  return (
    <div>
      <h1>Unauthorized</h1>
      <br />
      <p>You don&apos;t have access to the request page.</p>
      <div>
        <button onClick={goBack}>Back</button>
      </div>
    </div>
  );
};

export default Unauthorized;
