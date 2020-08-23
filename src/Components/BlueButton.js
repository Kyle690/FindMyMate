import React from "react";
import {Button} from "react-native-elements";
import {StyleSheet} from "react-native";

export default ({title,onPress})=>{
    return (
        <Button
            onPress={onPress}
            title={title}
            containerStyle={styles.container}
            buttonStyle={styles.buttonStyle}
        />
    )
}

const styles = StyleSheet.create({
    container:{
        borderRadius:50,
        width:'70%',
        alignSelf:'center'
    },
    buttonStyle:{
        backgroundColor:'#456fbe'
    }
})
