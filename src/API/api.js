import {friends} from "../Variables";


const degToRad=(deg)=>{
    var pi = Math.PI;
    return deg * (pi/180);
}
const earthRadius=6371;// km

function findDist(homeLoc,testLoc){

    const lat1 = degToRad(homeLoc.latitude);
    const lon1 = degToRad(homeLoc.longitude);

    const lat2 = degToRad(testLoc.latitude);
    const lon2 = degToRad(testLoc.longitude);


    const one = Math.sin(lat1)*Math.sin(lat2);
    const two = Math.cos(lat1)*Math.cos(lat2);
    const three = Math.cos(lon1-lon2);


    const firstBit= (one+ two* three)

    const dist = Math.acos(firstBit)*earthRadius

    return dist.toFixed(4);

}



export const FindFriendsApiCall=(data)=>{
    const {homeLocation,range,likes}=data;


    const friendsList= friends.reduce((a,v)=>{



        if(findDist(homeLocation,v.coords)<=range){

            if(v.likes.includes(likes[0])&& v.likes.includes(likes[1])){
                v['match']=2
                a.push(v);
            }else if(v.likes.includes(likes[0])|| v.likes.includes(likes[1])){
                v['match']=1;
                a.push(v);
            }
        }

        return a;
    },[]);

    return friendsList;

}
