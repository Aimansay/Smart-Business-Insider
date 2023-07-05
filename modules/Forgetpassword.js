import React, {FC, ReactElement, useState} from 'react';
import axios from "axios";
import {Alert, Text, TextInput, TouchableOpacity, View, StyleSheet, Dimensions, ImageBackground, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import 'react-native-get-random-values';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

export const ForgetPassword = () => {
  const navigation = useNavigation();

  // Your state variable
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');

  const doUserPasswordReset = async function () {

    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const ip = await AsyncStorage.getItem('ip');

     const response = await axios.post(`${ip}:3000/api/users/${userId}/verifyEmail`, {
     email
   }, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (response) {
    console.log("OK")
    //const data = await response.json();
    const { token } = response.data;
    await AsyncStorage.setItem('codeToken', token);
    
  } else {
    const errorData = await response.json();
    console.log('Error:', errorData.error);
  }
      //navigation.navigate("Settings")

    } catch (error) {
       console.log(error)
    }    
  };

  const verifyCode = async function () {

    try {
      
    const token = await AsyncStorage.getItem('codeToken');
      console.log(token)
    // Decode the token to get the email and code
    const decodedToken = jwtDecode(token);
    const { email: decodedEmail, code: decodedCode } = decodedToken;
    if (decodedEmail === email && decodedCode.toString() === code.toString()) {
      setVerificationStatus('Verification successful');
      navigation.navigate("Newpassword")
      
    } else {
      setVerificationStatus('Verification failed');
      // Handle the case where verification fails
    }

      //navigation.navigate("Settings")

    } catch (error) {
       console.log(error)
    }    
  };

  return (
    <KeyboardAwareScrollView>
    <ImageBackground
        source={require("../assets/signupbackground.png")}
        style={{ flex: 1, height: Dimensions.get("window").height }}
      > 
    <View style={{height: Dimensions.get("screen").height/2.9, width: Dimensions.get("screen").width/2}}>
        <Text style={{marginLeft: Dimensions.get("screen").height/75,paddingTop: 100, fontSize: 40, color: "white", fontWeight: "bold"}}>Recover Password</Text>
        </View>
      <View style={{marginLeft: Dimensions.get("screen").height/90}}>
        <Text>{'Please enter your account email to reset your password:'}</Text>
        <View style={{flexDirection: "row"}}>
            <Image
            source={require("../assets/person.png")}
            style={{width: Dimensions.get("screen").width/12.5,
              height: Dimensions.get("screen").height/24,
              marginTop: Dimensions.get("screen").height/255,
              borderColor: "black",
            }}/>
        <TextInput
          style={{ borderColor: "black", borderBottomWidth: 2, paddingTop: 5,
          fontSize: 25, textShadowColor: "black", width: Dimensions.get("screen").width/1.18}}
          value={email}
          placeholder={'Your account email'}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize={'none'}
          keyboardType={'email-address'}
        />
        </View>
        <TouchableOpacity onPress={() => doUserPasswordReset()}>
          <View style={{
                  margin: Dimensions.get("screen").height/45,
                  
                  backgroundColor: 'rgb(40,40,40)',
                  fontSize: 50,
                  borderRadius: 15,
                  marginLeft: Dimensions.get("screen").height/10,
                  marginRight: Dimensions.get("screen").height/10,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: Dimensions.get("screen").height/45,
                  shadowColor: "black",
                  shadowRadius: 200,
                  shadowOpacity: 200,
                }}>
            <Text  style={{
                    margin: Dimensions.get("screen").height/110,
                    fontSize: 18,
                    justifyContent: "center",
                    margin: Dimensions.get("screen").height/110,
                    fontStyle: "italic",
                    color: 'white',
                  }}
                  >{'Request password reset'}</Text>
          </View>
        </TouchableOpacity>
        <View>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginLeft: 10,
            }}>Enter The Code</Text>
            <Text style={{
                marginLeft: 10,
            }}>Enter the verification code sent on your Email</Text>
            <View style={{flexDirection: "row", marginLeft: 10}}>
            <Image
            source={require("../assets/icons8-code-48.png")}
            style={{width: 32,
              height: 32,
              marginTop: 5,
              borderColor: "black", borderBottomWidth: 2,
            }}/>
            <TextInput
                style={{ borderColor: "black", borderBottomWidth: 2, paddingTop: 5,
                fontSize: 25, textShadowColor: "black", width: 350 }}
                placeholder="  Enter the Code"
                onChangeText={(text) => setCode(text)}
              >
              </TextInput>
              </View>
              <TouchableOpacity
                onPress={verifyCode}
                style={{
                  margin: 5,
                  
                  backgroundColor: 'rgb(40,40,40)',
                  fontSize: 50,
                  borderRadius: 15,
                  marginLeft: 150,
                  marginRight: 150,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 30,
                  shadowColor: "black",
                  shadowRadius: 200,
                  shadowOpacity: 200, 
                }}
              >
                <Text
                  style={{
                    margin: 5,
                    fontSize: 23,
                    justifyContent: "center",
                    margin: 10,
                    fontStyle: "italic",
                    color: 'white',
                  }}
                >
                  Verify
                </Text>
              </TouchableOpacity>
              </View>
      </View>
    </ImageBackground>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    },
    menuContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    overflow: "hidden",
    },
    header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    },
    headerBackground: {
    height: Dimensions.get("window").height / 4,
    width: Dimensions.get("window").width,
    flexDirection: "row",
    alignItems: "center",
    },
    menuIcon: {
    width: 40,
    height: 40,
    marginLeft: 20,
    marginBottom: 40,
    },
    title: {
      fontWeight: 'bold',
      fontSize: 30,
      color: '#fff',
      marginTop: '-8%',
      marginLeft: '4%'
    },
    body: {
    flex: 8,
    backgroundColor: "transparent",
    flexDirection: "column",
    marginTop: "-5%",
    alignItems: "center",
    },
    profilePic: {
    width: 150,
    height: 150,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'black',
    margin: '10%',
    },
    button: {
      width: "90%",
      marginVertical: 5,
      backgroundColor: "grey",
      borderRadius: 15,
      paddingHorizontal: 20,
      paddingVertical: 10,
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
    },
    buttonContent: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    },
    buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "white",
    },
    buttonIcon: {
    width: 22,
    height: 20,
    marginLeft: "48%",
    },
    });


export default ForgetPassword;