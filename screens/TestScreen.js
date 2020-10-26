import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';



const TestScreen = () => {
return (
    <View>
        <Text>Hello from TestScreen</Text>
    </View>
);
};

TestScreen.navigationOptions = navData => {
    return {
        headerTitle: 'TestScreen',
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

export default TestScreen;