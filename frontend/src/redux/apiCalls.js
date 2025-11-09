import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import { publicRequest } from "../requestMethods";

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/login", user);
    dispatch(loginSuccess(res.data));

    const { accessToken, role } = res.data;

    if (role === "farmer") {
      localStorage.setItem("farmerToken", accessToken);
    } else if (role === "retailer") {
      localStorage.setItem("retailerToken", accessToken);
    }
  } catch (err) {
    dispatch(loginFailure());
  }
};
