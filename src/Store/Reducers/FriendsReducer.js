import {ADD_FRIEND} from "../types";

const INITIAL_STATE=[];

export default (state=INITIAL_STATE,{type,payload})=>{
    switch (type) {
        case ADD_FRIEND:
            return payload;
        default:
            return state;
    }
}

