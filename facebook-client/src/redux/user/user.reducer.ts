import { ReducerAction } from "../redux.types";
import ActionTypes from "./user.types";

const INITIAL_STATE = {
  currentUser: null,
  userToken: null,
  error: null,
  loading: true,
};

const userReducer = (state = INITIAL_STATE, action: ReducerAction) => {
  switch (action.type) {
    case ActionTypes.SIGN_IN_START:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.SIGN_IN_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        error: null,
      };
    case ActionTypes.SIGN_IN_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default userReducer;
