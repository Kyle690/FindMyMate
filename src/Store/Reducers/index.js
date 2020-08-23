import {combineReducers} from "redux";
import Profile from './ProfileReducer';
import Friends from './FriendsReducer';

const index={
    profile:Profile,
    friends:Friends
}
export default combineReducers(index);

