import React , {useState}  from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import ReduxThunk from 'redux-thunk';
import authReducer from './store/reducers/auth';
import NavigationContainer from './navigation/NavigationContainer';


const rootReducer = combineReducers ({
  auth: authReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = () => {
  return Font.loadAsync ({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  });  
};

export default function App() {

  const [fontLoaded, setFontLoaded] = useState(false);
  if(!fontLoaded) {
    return (
    <AppLoading startAsync={fetchFonts} 
    onFinish={()=>{
      setFontLoaded(true);
    }} 
    />
    );
  }

  return (
    //<View style={styles.container}>
    //  <Text>Open up App.js to start working on your application!</Text>
    //  <StatusBar style="auto" />
   // </View>
   <Provider store={store} >
   <NavigationContainer />
   </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
