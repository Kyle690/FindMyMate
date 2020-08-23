import React from 'react';
import {SafeAreaView, StyleSheet,Text, FlatList} from "react-native";
import {ListItem,Avatar} from "react-native-elements";
import {connect}from 'react-redux';


const FriendsScreen=({Friends, navigation})=>{


    const renderFriend=({item})=>{
        return (
            <ListItem
                onPress={()=>navigation.navigate('View Friend',{friend:item})}
                leftAvatar={
                    <Avatar
                        rounded
                        size={'medium'}
                        source={{uri:item.avatar}}
                    />
                }
                title={item.name}
                bottomDivider
                subtitle={<Text>{item.likes.join(', ')}</Text>}
            />
        )
    }
    const keyExtractor = (item, index) => index.toString()

    return (
        <SafeAreaView style={styles.safeView}>
            {Friends.length>0?
                <FlatList
                    data={Friends}
                    renderItem={renderFriend}
                    keyExtractor={keyExtractor}
                />:
                <Text style={{alignSelf:'center'}}>No friends added yet.</Text>
            }

        </SafeAreaView>
    )
}

const styles=StyleSheet.create({
    safeView:{
        ...StyleSheet.absoluteFillObject
    }
});

const mapStateToProps=state=>{
    return {Friends:state.friends};
}

export default connect(mapStateToProps)(FriendsScreen);
