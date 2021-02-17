import UserActionTypes from "./user.types";

export const signInSuccess = (user: any) => ({
  type: UserActionTypes.SIGN_IN_SUCCESS,
  payload: user,
});

export const signInFailure = (error: any) => ({
  type: UserActionTypes.SIGN_IN_FAILURE,
  payload: error,
});

export const signInRequest = (loginData: {
  email: string;
  password: string;
}) => ({
  type: UserActionTypes.SIGN_IN_START,
  payload: loginData,
});
