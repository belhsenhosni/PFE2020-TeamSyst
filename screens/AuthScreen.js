import React, { useEffect, useState, useReducer, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
  TextInput,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Input from '../components/Input';
import Card from '../components/Card';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import * as authActions from '../store/actions/auth';
import { isLoading } from 'expo-font';
import SignupScreen from './SignupScreen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from 'react-native-paper';



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
  const [hidePass, setHidePass] = useState(true);
  const { colors } = useTheme();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: ''
    },
    inputValidities: {
      email: false,
      password: false
    },
    formIsValid: false
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An error occured', error, [{ text: 'Okay' }]);
    }
  }, [
    error
  ]);

  function checkForm(formState) {
    setIsLoading(false);

    if(formState.inputValidities.email === false && formState.inputValidities.password === false ) {
      Alert.alert('Validation!', "Please enter your email and password");
    } else if (formState.inputValidities.email === false) {
      Alert.alert('Validation!', "Please enter your email");
    } else if (formState.inputValidities.password === false) {
      Alert.alert('Validation!', "Please enter your password");
    }
  }


  const authHandler = async () => {
    let action;
    if (isSignup) {
      action =
        authActions.signup(
          formState.inputValues.firstName,
          formState.inputValues.lastName,
          formState.inputValues.email,
          formState.inputValues.password,
          formState.inputValues.numTel

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
      if (formState.formIsValid) {
      await dispatch(action);
      props.navigation.navigate('Project');
      }else {
        checkForm(formState)
      }
    } catch (err) {
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
    <View style={styles.container}>
      <StatusBar backgroundColor='#009387' barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome!</Text>
      </View>
      <Animatable.View
        animation="fadeInUpBig"
        style={[styles.footer, {
          backgroundColor: colors.background
        }]}
      >
        <ScrollView>
          <View style={styles.action}>
            <FontAwesome
              name="user-o"
              color={colors.text}
              size={20}
              style={{ position: 'absolute', zIndex: 99, left: 2, top: 5 }}

            />
            <Input
              id="email"
              placeholder="Your Email"
              label="E-mail"
              keyboardType="email-address"
              errorText="Please enter a valid e-mail address"
              required
              email
              autoCapitalize="none"
              style={styles.textInput}
              autoCapitalize="none"
              intialValue=""
              onInputChange={inputChangeHandler}
            />
            {formState.inputValidities.email == false ?
              <Animatable.View
                animation="bounceIn"
              >
                <Feather
                  name="check-circle"
                  color="gray"
                  size={20}
                  style={{ position: 'absolute', zIndex: 99, left: -40, top: 50 }}

                />
              </Animatable.View>
              : null}
            {formState.inputValidities.email == true ?
              <Animatable.View
                animation="bounceIn"
              >
                <Feather
                  name="check-circle"
                  color="green"
                  size={20}
                  style={{ position: 'absolute', zIndex: 99, left: -40, top: 50 }}

                />
              </Animatable.View>
              : null}
          </View>


          <View style={styles.action}>
            <Feather
              name="lock"
              color={colors.text}
              size={20}
              style={{ position: 'absolute', zIndex: 99, left: 2, top: 5 }}

            />
            <Input
              id="password"
              label="Password"
              placeholder="Your Password"
              secureTextEntry={hidePass ? true : false}
              style={styles.textInput}
              autoCapitalize="none"
              required
              minLength={5}
              errorText="Please enter a valid password"
              onInputChange={inputChangeHandler}
            />
            <Icon
              name={hidePass ? 'eye-slash' : 'eye'}
              size={17}
              color="grey"
              onPress={() => setHidePass(!hidePass)}
              style={{ position: 'absolute', zIndex: 99, left: 277, top: 53 }}
            />
          </View>

          <TouchableOpacity>
                <Text style={{color: '#009387', marginTop:10}}>Forgot password?</Text>
            </TouchableOpacity>

          <View style={styles.textPrivate}>
            <Text style={styles.color_textPrivate}>
              By signing up you agree to our
                </Text>
            <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Terms of service</Text>
            <Text style={styles.color_textPrivate}>{" "}and</Text>
            <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Privacy policy</Text>
          </View>
          <View style={styles.button}>
            {isLoading ? (
                    <ActivityIndicator 
                    size='small' 
                    color={Colors.primary}
                    /> 
                ) : (
            <TouchableOpacity
              style={styles.signIn}
              onPress={authHandler}
            >
              <LinearGradient
                colors={['#08d4c4', '#01ab9d']}
                style={styles.signIn}
              >
                
                <Text style={[styles.textSign, {
                  color: '#fff'
                }]}>Sign Up</Text>
              </LinearGradient>
            </TouchableOpacity>
                          )}


            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('Signup');
              }}
              style={[styles.signIn, {
                borderColor: '#009387',
                borderWidth: 1,
                marginTop: 15
              }]}
            >
              <Text style={[styles.textSign, {
                color: '#009387'
              }]}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009387'
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50
  },
  footer: {
    flex: Platform.OS === 'ios' ? 3 : 5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18
  },
  action: {
    flexDirection: 'row',
    marginTop: -5,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
    flexDirection: 'row',
    paddingBottom: 0,
    paddingLeft: 27
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  button: {
    alignItems: 'center',
    marginTop: 15
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 25
  },
  color_textPrivate: {
    color: 'grey'
  }
});