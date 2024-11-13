// export const login = (credentials) => async (dispatch) => {
//   dispatch({ type: "LOGIN_REQUEST" });

//   try {
//     // Sample API call to authenticate user
//     const response = await fetch("https://jsonplaceholder.typicode.com/users/1", {
//       method: "GET", // Use "POST" with body if using a real authentication API
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }

//     const user = await response.json();

//     // Dispatch success action with user data
//     dispatch({
//       type: "LOGIN_SUCCESS",
//       payload: user,
//     });
//   } catch (error) {
//     // Dispatch failure action with error message
//     dispatch({
//       type: "LOGIN_FAILURE",
//       error: error.message,
//     });
//   }
// };
