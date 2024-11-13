import React from "react";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { accessToken } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.log(err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (accessToken) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  //   useEffect(() => {
  // console.log(`isLoading: ${isLoading}`);
  // console.log(`aT: ${accessToken}`);
  //   }, [isLoading, accessToken]);

  return <>{isLoading ? <p>Loading......</p> : <Outlet />}</>;
};

export default PersistLogin;
