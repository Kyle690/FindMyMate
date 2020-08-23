import React from 'react';
import {SafeAreaView, Text, StyleSheet, View, Dimensions, Image, Alert} from "react-native";
import {Avatar, Button, Slider} from "react-native-elements";
import MapView,{PROVIDER_GOOGLE, Circle, Marker,Callout} from "react-native-maps";
import {connect}from 'react-redux';
import Carousel from "react-native-snap-carousel/src/carousel/Carousel";
import {PERMISSIONS,request} from "react-native-permissions";
import Geolocation from "@react-native-community/geolocation";

import BlueButton from "../Components/BlueButton";
import {AddFriend, findFriends} from "../Store/Actions/FriendsActions";

const { height, width } = Dimensions.get( 'window' );

const initialStateRegion={
    latitude: -26.1930,
    longitude: 28.30824,
    latitudeDelta: 0.78,
    longitudeDelta: 0.78 * (width / height)
}
class HomeScreen extends React.Component{

    state={
        range:10,
        friends:[],
        location:null,
        markers:[]
    }

    componentDidMount() {
        this.requestLocation();
    }

    locateCurrentPosition=()=>{
        Geolocation.getCurrentPosition(position => {
           // console.log(JSON.stringify(position));
            let region ={
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.28,
                longitudeDelta: 0.28 * (width / height)
            }
            // set to initial region rather than current for testing
            this.setState({location:initialStateRegion})
        },error=>Alert.alert(error.message),{
            enableHighAccuracy:true,
            timeout:10000,
            maximumAge:1000
        })
    }

    requestLocation=async ()=>{
        if(Platform.OS==='ios'){
            const response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            if(response ==='granted'){
                this.locateCurrentPosition();
            }else if(response==='blocked'){
                Alert.alert('Please check your location settings!')
            }
        }else{
            const response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            if(response ==='granted'){
                this.locateCurrentPosition();
            }
        }
    }

    handleSearchFriends=()=>{
        this.props.findFriends(
            {
                range:this.state.range,
                homeLocation:this.state.location,
                likes:this.props.profile.likes
            },res=>{
                this.setState({friends:res.data});
            });

    }

    carouselItem=({item})=>{
        return (
            <View style={styles.cardContainer}>
                <Image source={{uri:item.avatar}} style={styles.cardImage}/>
                <View style={styles.textView}>
                    <Text style={styles.cardText}>{item.name}</Text>
                    <Text style={{color:'white'}}>Match: {item.match===1?"50%":'100%'}</Text>
                    <Button
                        onPress={()=>this.handleAddFriend(item)}
                        title={'Add Friend'}
                        titleStyle={{fontSize:12}}
                        containerStyle={{marginTop:5,height:30, borderRadius:20,width:150,marginBottom:10}}
                    />
                </View>
            </View>
        )
    }

    handleAddFriend=(friend)=>{
        this.props.AddFriend(friend,res=>{
            const stateFriends = this.state.friends.filter(f=>f.name!==friend.name);
            this.setState({friends:stateFriends});
        })
    }

    onCarouselItemChange=(index)=>{
        let location = this.state.friends[index];

        this._map.animateToRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.78,
            longitudeDelta: 0.78 * (width / height)
        })

        this.state.markers[index].showCallout()
    }

    onMarkerPress=(location,index)=>{
        this._map.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.28,
            longitudeDelta: 0.28 * (width / height)
        })

        this._carousel.snapToItem(index);
    }


    render(){
        const {friends,markers}=this.state;
        const {name}=this.props.profile;
        return (
            <SafeAreaView style={styles.container}>
                <MapView
                    ref={map=>this._map=map}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={initialStateRegion}
                    showsUserLocation={true}
                >
                    {friends.length>0?null:
                        <Marker
                            coordinate={{
                                longitude:initialStateRegion.longitude,
                                latitude:initialStateRegion.latitude
                            }}
                            title={this.props.profile.name}
                        />
                    }

                    <Circle
                        center={{
                            latitude:initialStateRegion.latitude,
                            longitude:initialStateRegion.longitude
                        }}
                        fillColor={'rgba(0,0,0,0.7)'}
                        radius={this.state.range}
                    />
                    {friends.length>0?
                        friends.map((f,index)=>{
                            return (
                                <Marker
                                    onPress={()=>this.onMarkerPress(f,index)}
                                    ref={ref=> this.state.markers[index] = ref}
                                    key={index}
                                    title={f.name}
                                    coordinate={{
                                        longitude:f.coords.longitude,
                                        latitude:f.coords.latitude
                                    }}
                                >
                                    <Callout>
                                        <Avatar size={'small'} source={{uri:f.avatar}}/>
                                    </Callout>
                                </Marker>
                            )
                        }):null

                    }
                </MapView>
                <View style={styles.rangeView}>
                    <Slider
                        step={1}
                        maximumValue={30}
                        minimumValue={1}
                        style={{marginLeft:40,marginRight:40}}
                        value={this.state.range}
                        onValueChange={(value) => this.setState({ range:value,friends:[] })}
                    />
                    <Text style={{alignSelf:'center'}}>Range in Km: {this.state.range}</Text>

                </View>
                {friends.length>0?
                    <View style={styles.buttonView}>
                        <Carousel
                            ref={(c) =>this._carousel = c}
                            removeClippedSubViews={false}
                            sliderWidth={Dimensions.get('window').width}
                            data={friends}
                            renderItem={this.carouselItem}
                            itemWidth={300}
                            onSnapToItem={(index) => this.onCarouselItemChange(index)}
                        />
                    </View>:
                    <View style={styles.buttonView}>
                        {name.length>0?
                            <BlueButton
                                title={'Find Friends'}
                                onPress={this.handleSearchFriends}
                            />:
                            <BlueButton
                                title={'Set up Profile'}
                                onPress={()=>this.props.navigation.navigate('Profile')}
                            />
                        }
                    </View>

                }

            </SafeAreaView>
        )
    }
}

const styles =StyleSheet.create({
    container:{
        ...StyleSheet.absoluteFillObject,
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    map:{
        ...StyleSheet.absoluteFillObject
    },
    rangeView:{
        width:'100%',
        top:0,
        position:'absolute',
        backgroundColor:'white'
    },
    buttonView:{
        width:'100%',
        bottom:0,
        position:'absolute',
        marginBottom:35,
    },
    cardContainer:{
        backgroundColor:"rgba(0,0,0,0.7)",
        height:300,
        width:300,
        padding:24,
        borderRadius:25
    },
    cardImage:{
        resizeMode:'cover',
        height:200,
        width:300,
        top:0,
        position:'absolute',
        borderTopLeftRadius:25,
        borderTopRightRadius:25
    },
    cardText:{
        alignSelf:'center',
        fontSize:20,
        fontWeight:'bold',
        color:'white',
    },
    textView:{
        marginTop:200,
        alignItems:'center',
        justifyContent:'center'
    }

})

const mapStateToProps=(state)=>{
    return {
        profile:state.profile
    }
}

export default connect(mapStateToProps,{AddFriend, findFriends})(HomeScreen);
