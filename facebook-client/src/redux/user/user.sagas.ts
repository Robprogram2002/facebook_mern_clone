import Axios from "axios";
import { put, takeLatest, all, call } from "redux-saga/effects";
import { signInFailure, signInSuccess } from "./user.actions";

import UserActionTypes from "./user.types";

export function* SignIn({ payload: { email, password } }: any) {
  try {
    const data = yield Axios.post("user/sign-in", {
      email,
      password,
    });

    console.log(data);

    // save user token on local-storage

    yield put(signInSuccess(data));
  } catch (error) {
    yield put(signInFailure(error));
  }
}

export function* onSignInStart() {
  yield takeLatest(UserActionTypes.SIGN_IN_START, SignIn);
}

/*



export function* isUserAuthenticated() {
  try {
    const userAuth = yield getCurrentUser();
    if (!userAuth) return;
    yield getSnapshotFromUserAuth(userAuth);
  } catch (error) {
    yield put(signInFailure(error));
  }
}

export function* signOut() {
  try {
    yield auth.signOut();
    yield put(signOutSuccess());
  } catch (error) {
    yield put(signOutFailure(error));
  }
}

export function* signUp({ payload: { email, password, displayName } }) {
  try {
    const { user } = yield auth.createUserWithEmailAndPassword(email, password);
    yield put(signUpSuccess({ user, additionalData: { displayName } }));
  } catch (error) {
    yield put(signUpFailure(error));
  }
}

export function* signInAfterSignUp({ payload: { user, additionalData } }) {
  yield getSnapshotFromUserAuth(user, additionalData);
}

export function* onGoogleSignInStart() {
  yield takeLatest(UserActionTypes.GOOGLE_SIGN_IN_START, signInWithGoogle);
}



export function* onCheckUserSession() {
  yield takeLatest(UserActionTypes.CHECK_USER_SESSION, isUserAuthenticated);
}

export function* onSignOutStart() {
  yield takeLatest(UserActionTypes.SIGN_OUT_START, signOut);
}

export function* onSignUpStart() {
  yield takeLatest(UserActionTypes.SIGN_UP_START, signUp);
}

export function* onSignUpSuccess() {
  yield takeLatest(UserActionTypes.SIGN_UP_SUCCESS, signInAfterSignUp);
}



*/
export function* userSagas() {
  yield all([call(onSignInStart)]);
}
