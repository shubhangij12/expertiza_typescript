import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

/**
 * @author Ankur Mundra on April, 2023
 */

const store = configureStore({ reducer: rootReducer });

export default store;
