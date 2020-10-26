import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Platform, SafeAreaView, Button, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer'; 
import Colors from '../constants/Colors';
import { useDispatch } from 'react-redux';
import HomeScreen from '../screens/HomeScreen';
import AuthScreen from '../screens/AuthScreen';
import StartupScreen from '../screens/StartupScreen';
import TestScreen from '../screens/TestScreen';
import * as authActions from '../store/actions/auth';
import SignupScreen from '../screens/SignupScreen';



const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
  },
  headerTitleStyle: {
    //fontFamily: 'open-sans-bold'
  },
  headerBackTitleStyle: {
   // fontFamily: 'open-sans'
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
};


const HomeNavigator = createStackNavigator(
  {
    Home: HomeScreen
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
          size={23}
          color={drawerConfig.tintColor}
        />
      )
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

const TestNavigator = createStackNavigator(
  {
    Test: TestScreen
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
          size={23}
          color={drawerConfig.tintColor}
        />
      )
    },
    defaultNavigationOptions: defaultNavOptions
  }
);


const ProjectNavigator = createDrawerNavigator(
  {
    Home: HomeNavigator,
    Test: TestNavigator
  
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary
    },
    contentComponent: props => {
      const dispatch = useDispatch();
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
            <DrawerItems {...props} />
            <Button
              title="Logout"
              color={Colors.primary}
              onPress={() => {
                dispatch(authActions.logout());
               props.navigation.navigate('Auth');
              }}
            />
          </SafeAreaView>
        </View>
      );
    }
  }
);

const SignupNavigator = createStackNavigator(
  {
    Signup: SignupScreen

  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
);

const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen

  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
);



const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: AuthNavigator,
  //Shop: ShopNavigator
  Project: ProjectNavigator,
  Signup:SignupNavigator

});


export default createAppContainer(MainNavigator);
