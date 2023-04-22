import { combineReducers } from "@reduxjs/toolkit";
import alertReducer from "./slices/alertSlice";

/**
 * @author Ankur Mundra on April, 2023
 */

const rootReducer = combineReducers({
  alert: alertReducer,
});
export default rootReducer;
