import React, {  useEffect, useState ,useReducer, useCallback } from 'react';
import { ScrollView, View, KeyboardAvoidingView, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '../components/Input';
import Card from '../components/Card';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import * as authActions from '../store/actions/auth';
import { isLoading } from 'expo-font';
import SignupScreen from './SignupScreen';

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

  
const AuthScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [isSignup, setIsSignup] = useState(false);
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
          email:'',
          password:''
        },
        inputValidities: {
          email: false,
          password: false
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
  

    const authHandler =  async () => {
        let action;
        if(isSignup) {
         action =
            authActions.signup(
                formState.inputValues.firstName,
                formState.inputValues.lastName,
                formState.inputValues.gender,
                formState.inputValues.email,
                formState.inputValues.password,
                formState.inputValues.number
               
                 );
        } else {
         action = authActions.login(
             formState.inputValues.email,
             formState.inputValues.password
             );
        }
        setError(null);
        setIsLoading(true);
        try {
       await dispatch(action);  
         props.navigation.navigate('Project');
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
            <View style={styles.buttonContainer}>
                {isLoading ? (
                    <ActivityIndicator 
                    size='small' 
                    color={Colors.primary}
                    /> 
                ) : (
            <Button 
            title="Login"
            color={Colors.primary}
             onPress={authHandler} 
             />
             )}
             </View>
             <View style={styles.buttonContainer}>
             <Button 
            title="SignUp" 
            color={Colors.accent}
             onPress={() => {
                 props.navigation.navigate('Signup');
             }}
              />

              </View>
           </ScrollView>
       </Card>
       </LinearGradient>
       </KeyboardAvoidingView>
   );
};

AuthScreen.navigationOptions = {
    headerTitle: "Authenticate"
};

const styles = StyleSheet.create({
    screen: {
        flex:1
        
    },
    authContainer: {
        width:'80%',
        maxWidth: 400,
        maxHeight: 400,
        padding:20

    },
    gradient: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        marginTop: 10
    }
});

export default AuthScreen;