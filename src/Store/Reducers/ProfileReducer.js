import {UPDATE_PROFILE} from "../types";

const INITIAL_STATE={
    name:'',
    likes:[]
}
export default (state=INITIAL_STATE,action)=>{

    switch (action.type) {
        case UPDATE_PROFILE:
            return {name:action.payload.name,likes:action.payload.likes}
        default:
            return {...state}
    }
}
