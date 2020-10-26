import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';


const HomeScreen = () => {
return (
    <View>
        <Text>Hello from HomeScreen</Text>
    </View>
);
};


HomeScreen.navigationOptions = navData => {
    return {
        headerTitle: 'HomeScreen',
        headerLeft: (
        <HeaderButtons HeaderButtonComponent={HeaderButton} >
        <Item title='Menu' iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
         onPress={() => { 
             navData.navigation.toggleDrawer();
                  }}
        />
    </HeaderButtons>)
    }
    };
    



const style=StyleSheet.create({

});

export default HomeScreen;