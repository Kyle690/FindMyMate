import React, {useReducer, useEffect} from 'react';
import {SafeAreaView, StyleSheet, View, FlatList, Alert} from "react-native";
import {connect}from 'react-redux';
import {Input,ListItem, Button,Text} from "react-native-elements";
import Emoji from "react-native-emoji";


import {Likes} from "../Variables";
import GreenButton from "../Components/GreenButton";
import {UpdateProfile} from "../Store/Actions/profileActions";


const initialState={
    name:'',
    likes:[]
}

const reducer=(state,{type,payload})=>{
    switch (type) {
        case 'addLike':
            return {...state,likes:payload}
        case 'load':
            return {name:payload.name,likes:payload.likes}
        case 'clearLikes':
            return {...state,likes:[]}
        case'name':
        return {...state,name:payload}
        default:
            return {...state}
    }
}

const ProfileScreen=({profile,navigation, UpdateProfile})=>{

    const [state,dispatch]=useReducer(reducer,initialState);

    useEffect(()=>{

       dispatch({type:'load',payload:{name:profile.name,likes:profile.likes}});
    },[])

    const handleLike=(item)=>{
        const likes = state.likes;
        if(likes.includes(item.name)){
            // remove like
            const newLikes=likes.filter(l=>item.name!==l);
            dispatch({type:'addLike',payload:newLikes})
        }else{
            // add to like
            if(likes.length<2){
                likes.push(item.name)
                dispatch({type:'addLike',payload:likes})
            }else{
                Alert.alert("Please select only two likes, remove a like to continue.")
            }

        }




    }

    const renderLikeItem=({item})=>{

        return (
            <ListItem
                onPress={()=>handleLike(item)}
                containerStyle={state.likes.includes(item.name)?styles.unselectedLike:styles.selectedLike}
                rightIcon={<Emoji name={item.emoji} style={styles.emoji}/>}
                bottomDivider
                title={<Text style={styles.likeText}>I <Emoji name={'heart'}/> {item.name}</Text>}
            />
        )
    }

    const keyExtractor = (item, index) => index.toString()

    const handleSave=()=>{
        const {name,likes}=state;
        if(name.length<=0 || likes.length!==2){
            Alert.alert('Please ensure you have entered your name and selected some likes.')
        }else{
            UpdateProfile({name,likes},()=>navigation.navigate('Home'))
        }
    }


    return (
        <SafeAreaView style={styles.safeView}>
            <Input
                value={state.name}
                containerStyle={styles.input}
                label={'Name'}
                placeholder={'Your name...'}
                onChangeText={(t)=>dispatch({type:'name',payload:t})}
            />
            <Text style={styles.likesTitle} h4>What I <Emoji name={'heart'}/></Text>
            <Text style={styles.pText}>Select two likes from the list below to match up with friends</Text>
            <FlatList
                style={{marginBottom:70}}
                keyExtractor={keyExtractor}
                data={Likes}
                renderItem={renderLikeItem}
            />
            <GreenButton
                onPress={handleSave}
                icon={'save'}
                title={'Save'}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pText:{
        fontSize:12,
        alignSelf:'center'
    },
    input:{
      marginTop:10
    },
    likesTitle:{
        marginTop:10,
        alignSelf:'center'
    },
    safeView:{
      ...StyleSheet.absoluteFillObject
    },
    buttonStyle:{
      bottom:0,
      position:'absolute',
      marginBottom:50,
      alignSelf:'center'
    },
    emoji:{
        fontSize:30,
        marginLeft:25
    },
    likeText:{
        fontSize: 25,
        fontWeight:'bold',
        alignItems:'center'
    },
    selectedLike:{
        marginTop:10
    },
    unselectedLike:{
        marginTop:10,
        backgroundColor:'grey'
    }
})

const mapStateToProps=(state)=>{
    return {
        profile:state.profile,
    };
}

export default connect(mapStateToProps, {UpdateProfile})(ProfileScreen);
