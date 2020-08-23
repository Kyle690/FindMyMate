import {ADD_FRIEND} from "../types";
import {FindFriendsApiCall} from "../../API/api";


export const findFriends=(data,callback)=>(dispatch,getState)=>{
    // fake api to search through a list of pre determined friends, likes and locations
    //data = {range,homeLocation,likes}
    const response =FindFriendsApiCall(data);
    const existing = getState().friends;

    const newFriends =response.filter(f=>{
        return !existing.find(e=>{return e.name===f.name})

    })

    callback({status:1,data:newFriends});
}

export const AddFriend=(Friend,Callback)=>(dispatch,getState)=>{
    const friends = getState().friends

    friends.push(Friend);
    dispatch({type:ADD_FRIEND,payload:friends});
    Callback();
}
