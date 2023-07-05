import React, {useEffect, useState} from "react";
import axios from "axios";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import User from "./User";
import * as LocalAuthentication from 'expo-local-authentication';

const Login = () => {

  const[finger, setFinger] = useState(false);

  const handleBioAuth = async () => {
    const isSupported = await LocalAuthentication.hasHardwareAsync();

    if (!isSupported) {
      return alert("Not Supported");
    }

    let supportedTypes;
    if(isSupported) {
      supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      const bioAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Login",
        cancelLabel: "cancel",
        disableDeviceFallback: true,
      });

      if (bioAuth) {
        navigation.navigate("Homepage")
      }
    }
  }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const navigation = useNavigation();

    const handleSignIn = async () => {
      console.log("Logging")
     try {
      const ip = await AsyncStorage.getItem('ip');
      const response = await axios.post(`${ip}:3000/api/users/login`, {
      email, password
    })
          // Retrieve JWT token and user ID from the response
        const { token, userId } = response.data;
        User.Name = response.data.username;

        // Store the token and user ID in localStorage or state for later use
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('userId', userId);
          await AsyncStorage.setItem("username", User.Name);
          console.log(User.Name);
        navigation.navigate("Homepage");

        
     } catch (error) {
        console.log(error)
     }   
    };

    const checkFingerPrint = async () => {
      const check = await AsyncStorage.getItem("fingerprint");
      console.log(check);
      if (await AsyncStorage.getItem("fingerprint") === "true") {
        setFinger(true);
      }
    }

    useEffect(() => {
      checkFingerPrint();
    }, [])

    return (
      <KeyboardAwareScrollView>
      <ImageBackground
        source={require("../assets/Loginbackground.png")}
        style={{ flex: 1, height: "100%" }}
      > 
        <View style={{height: Dimensions.get("screen").height/2.1, width: Dimensions.get("screen").width/2}}>
        <Text style={{marginLeft: Dimensions.get("screen").height/75,paddingTop: 130, fontSize: 40, color: "white", fontWeight: "bold"}}>Smart Business Insider</Text>
        </View>
        <View>
            <Text style={styles.title}>Log in</Text>
        </View>
        <View style={{paddingTop: 10, marginLeft: Dimensions.get("screen").height/75}}>
            <Text>Email or Username</Text>
            <View style={{flexDirection: "row"}}>
            <Image
            source={require("../assets/email.png")}
            style={{width: Dimensions.get("screen").width/12.5,
            height: Dimensions.get("screen").height/24,
            marginTop: Dimensions.get("screen").height/255,
            }}/>
            <TextInput
                style={{ borderColor: "black", borderBottomWidth: 2, paddingBottom: 5, marginLeft: 10, 
                fontSize: 15, textShadowColor: "black", width: Dimensions.get("screen").width/1.18 }}
                placeholder="  Enter email or username"
                onChangeText={setEmail}
              >
              </TextInput>
              </View>
              </View>
        <View style={{paddingTop: 30, marginLeft: Dimensions.get("screen").height/75}}>
            <Text>Your Password</Text>
            <View style={{flexDirection: "row"}}>
            <Image
            source={require("../assets/password.png")}
            style={{width: Dimensions.get("screen").width/12.5,
            height: Dimensions.get("screen").height/24,
            marginTop: Dimensions.get("screen").height/255,
              borderColor: "black", borderBottomWidth: 2,
            }}/>
            <TextInput
                style={{ borderColor: "black", borderBottomWidth: 2, paddingBottom: 5, marginLeft: 10,
                fontSize: 16, textShadowColor: "black", width: Dimensions.get("screen").width/1.18  }}
                placeholder="  Enter your password"
                secureTextEntry={true}
                onChangeText={setPassword}
              >
              </TextInput>
              </View>

            
              <TouchableOpacity
                onPress={handleSignIn}
                // onPress={() => {
                //   navigation.navigate("Homepage");
                // }}
                style={{
                  margin: Dimensions.get("screen").height/45,
                  
                  backgroundColor: 'rgb(40,40,40)',
                  fontSize: 50,
                  borderRadius: 15,
                  marginLeft: Dimensions.get("screen").height/10,
                  marginRight: Dimensions.get("screen").height/10,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: Dimensions.get("screen").height/20,
                  shadowColor: "black",
                  shadowRadius: 200,
                  shadowOpacity: 200,
                   
                }}
              >
                <Text
                  style={{
                    margin: Dimensions.get("screen").height/110,
                    fontSize: 18,
                    justifyContent: "center",
                    fontStyle: "italic",
                    color: 'white',
                  }}
                >
                  Log In
                </Text>
              </TouchableOpacity>

              {finger ? (<TouchableOpacity
                onPress={handleBioAuth}
                // onPress={() => {
                //   navigation.navigate("Homepage");
                // }}
                style={{
                  marginHorizontal: Dimensions.get("screen").height/45,
                  
                  backgroundColor: 'rgb(40,40,40)',
                  fontSize: 50,
                  borderRadius: 15,
                  marginLeft: Dimensions.get("screen").height/10,
                  marginRight: Dimensions.get("screen").height/10,
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "black",
                  shadowRadius: 200,
                  shadowOpacity: 200,
                   
                }}
              >
                <Text
                  style={{
                    margin: Dimensions.get("screen").height/110,
                    fontSize: 18,
                    justifyContent: "center",
                    fontStyle: "italic",
                    color: 'white',
                  }}
                >
                  Fingerprint
                </Text>
              </TouchableOpacity>) : <></>}
                <TouchableOpacity 
                 onPress={() => {
                  navigation.navigate("forgetpassword");
                }}
                style={{color: "black", 
                alignContent: "center", 
                marginRight: Dimensions.get("screen").height/110, 
                marginLeft: Dimensions.get("screen").height/6.3,
                }}><Text>Forgot Password?</Text></TouchableOpacity>
                <View style={{flexDirection: "row", marginLeft: Dimensions.get("screen").height/10,}}>
                <Text style={{paddingTop: 15}}>Don't have an account?</Text>
                <TouchableOpacity 
                 onPress={() => {
                    navigation.navigate("Signup");
                  }}
                style={{color: "black", 
                alignContent: "center", 
                marginRight: Dimensions.get("screen").height/10, 
                }}><Text style={{fontWeight: "bold", fontSize: 18, paddingTop: 12}}>  Sign Up</Text></TouchableOpacity>
                </View>
        </View>
      </ImageBackground>
      </KeyboardAwareScrollView> 
    );
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    fontWeight: "bold",
    fontSize: 25,
    color: "black",
    marginLeft: Dimensions.get("screen").height/75,
  },
  body: {
    flex: 8,
    backgroundColor: "rgba(0, 0, 0, 0)",
    flexDirection: "column",
  },

});

export default Login;
