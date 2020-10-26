import React, {  useEffect, useState ,useReducer, useCallback } from 'react';
import { ScrollView, View, KeyboardAvoidingView, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '../components/Input';
import Card from '../components/Card';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import * as authActions from '../store/actions/auth';
import { isLoading } from 'expo-font';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import { AntDesign } from '@expo/vector-icons';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';


const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
      const updatedValues = {
        ...state.inputValues,
        [action.input]: action.value
      };
      const updatedValidities = {
        ...state.inputValidities,
        [action.input]: action.isValid
      };
      let updatedFormIsValid = true;
      for (const key in updatedValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
      }
      return {
        formIsValid: updatedFormIsValid,
        inputValidities: updatedValidities,
        inputValues: updatedValues
      };
    }
    return state;
  };

  
  
const SignupScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [isSignup, setIsSignup] = useState(false);
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
          firstName:'',
          lastName:'',
          gender:'',
          email:'',
          password:'',
          number:''
        },
        inputValidities: {
          firstName:false,
          lastName:false,
          gender:false,
          email: false,
          password: false,
          number:false
        },
        formIsValid: false
      });

      useEffect(()=> {
        if (error) {
             Alert.alert('An error occured', error, [{text: 'Okay'}]);
        }
    }, [
        error
    ]);

    function checkForm(formState) {
      setIsLoading(false);

      if(formState.inputValidities.firstName === false){
        Alert.alert('Validation!', "Please enter your firstName");
      } else if (formState.inputValidities.lastName === false){
        Alert.alert('Validation!', "Please enter your lastName");
      }else if (formState.inputValidities.gender === false){
        Alert.alert('Validation!', "Please enter your gender");
      }else if (formState.inputValidities.email === false){
        Alert.alert('Validation!', "Please enter your email");
      }else if (formState.inputValidities.password === false){
        Alert.alert('Validation!', "Please enter your password");
      }else if (formState.inputValidities.number === false){
        Alert.alert('Validation!', "Please enter your Phone Number");
      }
  }
  
    const authHandlerSignup =  async () => {

        let action =
          authActions.signup(
            formState.inputValues.firstName,
            formState.inputValues.lastName,
            formState.inputValues.gender,
            formState.inputValues.email,
            formState.inputValues.password,
            formState.inputValues.number
               );
      
      setError(null);
      setIsLoading(true);
      try {
        if (formState.formIsValid) {
          await dispatch(action);
          props.navigation.navigate('Project');  
      } else {
          checkForm(formState)
      }
    
    } catch (err){
      setError(err.message);
      setIsLoading(false);
      }
  };

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
          dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
          });
        },
        [dispatchFormState]
      );

   return ( 
       <KeyboardAvoidingView
        //behavior='padding' 
        //keyboardVerticalOffset={50}
         style={styles.screen}
         >
        
        <LinearGradient 
        colors={['#ffefdd', '#ffe3ff']}
        style={styles.gradient}
        >
       <Card style={styles.authContainer}>
           <ScrollView>
           <Input 
            id="firstName" 
            label="FirstName"
            keyboardType="default"
            required
            //email
            autoCapitalize="none"
            errorText="Please enter a valid e-mail firstname"
            onInputChange ={inputChangeHandler}
            intialValue=""
            />
            <Input 
            id="lastName" 
            label="LastName"
            keyboardType="default"
            //secureTextEntry
            required
            //minLength={5}
            autoCapitalize="none"
            errorText="Please enter a valid LastName"
            onInputChange ={inputChangeHandler}
            //intialValue=""
            />
             <Input 
            id="gender" 
            label="Gender"
            keyboardType="default"
            //secureTextEntry
            required
            //minLength={5}
            autoCapitalize="none"
            errorText="Please enter a valid Gender"
            onInputChange ={inputChangeHandler}
            //intialValue=""
            />
            <Input 
            id="email" 
            label="E-mail"
            keyboardType="email-address"
            required
            email
            autoCapitalize="none"
            errorText="Please enter a valid e-mail address"
            onInputChange ={inputChangeHandler}
            intialValue=""
            />
            <Input 
            id="password" 
            label="Password"
            keyboardType="default"
            secureTextEntry
            required
            minLength={5}
            autoCapitalize="none"
            errorText="Please enter a valid password"
            onInputChange ={inputChangeHandler}
            //intialValue=""
            />
             <Input 
            id="number" 
            label="Number"
            keyboardType="phone-pad"
            //secureTextEntry
            required
            //minLength={5}
            autoCapitalize="none"
            errorText="Please enter a valid Number"
            onInputChange ={inputChangeHandler}
            //intialValue=""
            />
            
            <View style={styles.buttonContainer}>
                {isLoading ? (
                    <ActivityIndicator 
                    size='small' 
                    color={Colors.primary}
                    /> 
                ) : (
            <Button 
            title="Register"
            color={Colors.primary}
             onPress={authHandlerSignup} 
             /> 
             )}
             </View>
           </ScrollView>
       </Card>
       </LinearGradient>
       </KeyboardAvoidingView>
   );
};


SignupScreen.navigationOptions = {
    headerTitle: "Signup"
};


SignupScreen.navigationOptions = navData => {
  return {
      headerTitle: 'SignupScreen',
      headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton} >
      {/* <Item title='Menu' iconName={Platform.OS === 'android' ? 'arrowleft' : 'ios-menu'}
       onPress={() => { 
           navData.navigation.navigate('Auth');
                }}
      /> */}
      <AntDesign name="arrowleft" size={30} color="white" 
      onPress={() => { 
        navData.navigation.navigate('Auth');
             }}
      />
  </HeaderButtons>)
  }
  };

const styles = StyleSheet.create({
    screen: {
        flex:1
        
    },
    authContainer: {
        width:'80%',
        maxWidth: 500,
        maxHeight: 500,
        padding:20

    },
    gradient: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        marginTop: 20
    }
});

export default SignupScreen;