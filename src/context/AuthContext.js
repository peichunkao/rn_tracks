import createDataContext from "./createDataContext";
import trackerApi from "../api/tracker";
import { AsyncStorage } from "react-native";
import { navigate } from "../navigationRef";

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    case "signin":
      return { errorMessage: "", token: action.payload };
    case "signout":
      return { errorMessage: "", token: null };
    default:
      return state;
  }
};

const tryLocalSignin = dispatch => async () => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    dispatch({ type: "signin", payload: token });
    navigate("TrackList");
  } else {
    navigate("Signup");
  }
};

const clearErrorMessage = dispatch => () => {
  dispatch({ type: "clear_error_message" });
};

const signup = dispatch => {
  return async ({ email, password }) => {
    try {
      const response = await trackerApi.post("/signup", { email, password });
      // console.log(response.data);
      await AsyncStorage.setItem("token", response.data.token);
      // await AsyncStorage.getItem('token')
      dispatch({ type: "signin", payload: response.data.token });

      navigate("TrackList");
    } catch (err) {
      // console.log(err.message);
      dispatch({
        type: "add_error",
        payload: "Something went wrong with signup."
      });
    }
  };
};

const signout = dispatch => async () => {
  await AsyncStorage.removeItem("token");
  dispatch({ type: "signout" });
  navigate("loginFlow");
};

const signin = dispatch => {
  return async ({ email, password }) => {
    try {
      const response = await trackerApi.post("/signin", { email, password });
      await AsyncStorage.setItem("token", response.data.token);
      dispatch({ type: "signin", payload: response.data.token });
      navigate("TrackList");
    } catch (err) {
      dispatch({
        type: "add_error",
        payload: "Something went wrong with signin."
      });
    }
  };
};

export const { Context, Provider } = createDataContext(
  authReducer,
  { signup, signout, signin, clearErrorMessage, tryLocalSignin, signout },
  { token: null, errorMessage: "" }
);
