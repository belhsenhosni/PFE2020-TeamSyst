import React,{ Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';


export default class CustomAlertComponent extends Component {
    render() {
     return (
      <View style={styles.container}>
      <Text>Custom Alert Component</Text>
      </View>
     )
    }
}


const styles = StyleSheet.create({
    container: {
        height: '25%',
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#009387',
        borderWidth:1,
        borderColor:'#009387'
    }

});