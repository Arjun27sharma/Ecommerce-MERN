import {createStore, applyMiddleware, combineReducers} from "redux"
import thunk from "redux-thunk"
import {composeWithDevTools} from "redux-devtools-extension"
import { productReducer } from "./reducers/ProductReducer.js";
import { userReducer } from "./reducers/userReducer.js";

const reducer = combineReducers({
    products : productReducer,
    user:userReducer

})

let initialState = {};

const middleware = [thunk]


const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))


export default store