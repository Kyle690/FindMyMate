import 'react-native-gesture-handler';
import  React from 'react';
import {View,Text, Button}from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {ThemeProvider} from "@react-navigation/native";
import {Provider}from 'react-redux';


// components
import Store from './src/Store/index';

// Screens
import HomeScreen from "./src/Screens/HomeScreen";
import ProfileScreen from "./src/Screens/ProfileScreen";
import FriendsScreen from "./src/Screens/FriendsScreen";
import MapView from "react-native-maps";
import ViewFriendScreen from "./src/Screens/ViewFriend";

const MainStack=createStackNavigator();

const Theme={
    colors:{
        light:'#F5F1F3',
        dark:'#050505'
    }
}

const FriendStack=createStackNavigator();

const FriendStackNavigator=()=>{
    return(
        <FriendStack.Navigator>
            <FriendStack.Screen name={'Friends'} component={FriendsScreen}/>
            <FriendStack.Screen name={'View Friend'} component={ViewFriendScreen}/>
        </FriendStack.Navigator>
    )
}

const App =()=>{
  return (
      <Provider store={Store}>
          <ThemeProvider value={Theme}>
            <NavigationContainer>
              <MainStack.Navigator>
                  <MainStack.Screen name={'Home'} component={HomeScreen}
                                    options={({ navigation, route }) => ({
                                        headerRight: () => <Button
                                            title={'Friends'}
                                            onPress={()=>navigation.navigate('Friends')}/>,
                                        headerLeft:()=><Button
                                            title={'Profile'}
                                            onPress={()=>navigation.navigate('Profile')}
                                        />
                                    })}
                  />
                  <MainStack.Screen name={'Profile'} component={ProfileScreen}/>
                  <MainStack.Screen name={'Friends'} component={FriendStackNavigator}/>
              </MainStack.Navigator>

          </NavigationContainer>
          </ThemeProvider>
      </Provider>
  )
}
export default App;
