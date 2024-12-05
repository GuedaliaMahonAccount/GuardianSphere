import { combineReducers, configureStore } from "@reduxjs/toolkit";
import loginReducer from "./loginReducer";
import followReducer from './FollowReducer';

const rootReducer = combineReducers({
  login: loginReducer,
  follow: followReducer

});

const store = configureStore({ reducer: rootReducer });

export default store;