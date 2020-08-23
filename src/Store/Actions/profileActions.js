import {UPDATE_PROFILE} from "../types";

export const UpdateProfile=(data,callback)=>dispatch=>{
    //save information to db

    // save information to redux
    dispatch({type:UPDATE_PROFILE,payload:{name:data.name,likes:data.likes}})

    callback();
}

