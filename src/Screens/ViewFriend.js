import React from "react";
import {View, StyleSheet, Button} from "react-native";
import {Image,Text,Avatar} from "react-native-elements";
import Emoji from "react-native-emoji";
import GreenButton from "../Components/GreenButton";

const ViewFriendScreen=({route, navigation})=>{

    const {friend}=route.params;
    const {avatar,likes,name}=friend;

    React.useEffect(() => {
        navigation.setOptions({
            headerTitle:name,
            headerRight: () =>
                <Button
                    titleStyle={{color:'red'}}
                    onPress={()=>console.log('delete friend')}
                    title="Remove"
                />

        });
    }, []);

    return (
        <View style={styles.container}>
            <Avatar
                size={'xlarge'}
                rounded
                source={{uri:avatar}}
            />
            <Text style={styles.title} h3>{name}</Text>
            {likes.map(like=>{
                return(
                    <Text key={like} style={styles.likeText}>
                        I <Emoji name={'heart'}/> {like}
                    </Text>
                )
            })}
            <GreenButton
                title={"Request a meet"}
            />
        </View>
    )
}
const styles=StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        marginTop:50
    },
    title:{
      marginTop:50,
    },
    avatar:{
        height:'50%'
    },
    likeText:{
        fontSize:22
    }
})
export default ViewFriendScreen;
