import React, {useState} from "react";
import axios  from "axios";
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

function ValidateEmail(inputText) {
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if(inputText.match(mailformat)) {
    return true;
  }
  else  {
    alert("You have entered an invalid email address!");
    return false;
  }
}

function CheckPassword(inputtxt) { 
  var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  if(inputtxt.match(passw)) { 
    return true;
  } else { 
    alert('Password must contain atleast one uppercase letter, one lower case letter and one number')
    return false;
  }
}

const Signup = () => {
  const [Name, setName] = useState('');
  const [businessName, setbusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const navigation = useNavigation();

  const handleSignUp = async () => {

   try {
    const ip = await AsyncStorage.getItem('ip');
    const response = await axios.post(`${ip}:3000/api/users`, {
      Name, businessName, username, email, password, confirmPassword
  })
    // Retrieve JWT token and user ID from the response
  const { token, userId } = response.data;
  User.Name = response.data.username;
  User.businessName = response.data.businessName;

  // Store the token and user ID in localStorage or state for later use
         await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('userId', userId);

  navigation.navigate("Homepage");
      
   } catch (error) {
      console.log(error.response.status);
      if (error.response.status === 410) {
        alert ("User Already Exists");
      }
      
   } 
  };

  

    return (
      <KeyboardAwareScrollView>
      <ImageBackground
        source={require("../assets/signupbackground.png")}
        style={{ flex: 1, height: "100%" }}
      > 
      
      <View style={{height: Dimensions.get("screen").height, width: Dimensions.get("screen").width}}>
        <View style={{height: Dimensions.get("screen").height/3, width: Dimensions.get("screen").width/2}}>
        <Text style={{marginLeft: Dimensions.get("screen").height/75,paddingTop: Dimensions.get('screen').height/12, fontSize: 40, color: "white", fontWeight: "bold"}}>Smart Business Insider</Text>
        </View>
        <View>
            <Text style={styles.title}>Sign Up</Text>
        </View>
        <View style={{paddingTop: -Dimensions.get('screen').height/100, marginLeft: Dimensions.get("screen").height/75}}>
            <View style={{flexDirection: "row"}}>
            <Image
            source={require("../assets/person.png")}
            style={{width: Dimensions.get("screen").width/12.5,
              height: Dimensions.get("screen").height/24,
              marginTop: 10,
              borderColor: "black",
              marginRight: 6,
            }}/>
            <TextInput
                style={{ borderColor: "black", borderBottomWidth: 2, paddingTop: 10,
                fontSize: 15, textShadowColor: "black", width: Dimensions.get("screen").width/1.18}}
                placeholder="  Enter your username"
                onChangeText={setUsername}
              >
              </TextInput>
              </View>
              </View>
        <View style={{paddingTop: 10, marginLeft: Dimensions.get("screen").height/75}}>
            <View style={{flexDirection: "row"}}>
            <Image
            source={require("../assets/person.png")}
            style={{width: Dimensions.get("screen").width/12.5,
            height: Dimensions.get("screen").height/24,
            marginTop: 10,
              borderColor: "black",
              marginRight: 6,
            }}/>
            <TextInput
                style={{ borderColor: "black", borderBottomWidth: 2, paddingTop: 10,
                fontSize: 15, textShadowColor: "black", width: Dimensions.get("screen").width/1.18}}
                placeholder="  Enter your name"
                onChangeText={setName}
              >
              </TextInput>
              </View>
              </View>
              <View style={{paddingTop: 10, marginLeft: Dimensions.get("screen").height/75}}>
            <View style={{flexDirection: "row"}}>
            <Image
            source={require("../assets/person.png")}
            style={{width: Dimensions.get("screen").width/12.5,
            height: Dimensions.get("screen").height/24,
            marginTop: 10,
              borderColor: "black",
              marginRight: 6,
            }}/>
            <TextInput
                style={{ borderColor: "black", borderBottomWidth: 2, paddingTop: 10,
                fontSize: 15, textShadowColor: "black", width: Dimensions.get("screen").width/1.18}}
                placeholder="  Enter your business name"
                onChangeText={setbusinessName}
              >
              </TextInput>
              </View>
              </View>
              
            <View style={{paddingTop: 15, marginLeft: Dimensions.get("screen").height/75}}>
              <View style={{flexDirection: "row"}}>
                <Image
                source={require("../assets/email.png")}
                style={{width: Dimensions.get("screen").width/12.5,
                height: Dimensions.get("screen").height/24,
                marginTop: 10,
                  borderColor: "black",
                  marginRight: 6,
                }}/>
                <TextInput
                style={{ borderColor: "black", borderBottomWidth: 2, paddingTop: 10,
                fontSize: 15, textShadowColor: "black", width: Dimensions.get("screen").width/1.18}}
                placeholder="  Enter your email"
                onChangeText={setEmail}
                >
                </TextInput>
              </View>
            </View>
        <View style={{paddingTop: 30, marginLeft: Dimensions.get("screen").height/75}}>
            <View style={{flexDirection: "row"}}>
            <Image
            source={require("../assets/password.png")}
            style={{width: Dimensions.get("screen").width/12.5,
            height: Dimensions.get("screen").height/24,
            marginTop: Dimensions.get("screen").height/255,
              borderColor: "black",
              marginRight: 6,
            }}/>
            <TextInput
                style={{ borderColor: "black", borderBottomWidth: 2, paddingTop: 5,
                fontSize: 15, textShadowColor: "black", width: Dimensions.get("screen").width/1.18}}
                placeholder="  Enter your password"
                secureTextEntry={true}
                onChangeText={setPassword}
              >
              </TextInput>
              </View>
              <View style={{paddingTop: 30, marginLeft: Dimensions.get("screen").height/345}}>
            <View style={{flexDirection: "row"}}>
            <Image
            source={require("../assets/password.png")}
            style={{width: Dimensions.get("screen").width/12.5,
            height: Dimensions.get("screen").height/24,
            marginTop: Dimensions.get("screen").height/255,
              borderColor: "black",
              marginRight: 6,
            }}/>
            <TextInput
                style={{ borderColor: "black", borderBottomWidth: 2, paddingTop: 5,
                fontSize: 15, textShadowColor: "black", width: Dimensions.get("screen").width/1.18 }}
                placeholder="  Confirm your password"
                secureTextEntry={true}
                onChangeText={setConfirmPassword}
              >
              </TextInput>
              </View>
              </View>
              <TouchableOpacity
                onPress={ () => {
                  if (username && firstName && email && password && confirmPassword && businessName) {
                    if (password === confirmPassword ) {
                      if (ValidateEmail(email) && CheckPassword(password)) {
                        handleSignUp();
                      }
                    } else {
                      alert("Passwords do not match!");
                    }
                  } else {
                    alert("Fill out the complete form!");
                  }
                }}
                // onPress={() => {
                //   navigation.navigate("Homepage");
                // }}
                style={{
                  margin: Dimensions.get("screen").height/45,
                  
                  backgroundColor: 'rgb(40,40,40)',
                  borderRadius: 15,
                  marginLeft: Dimensions.get("screen").height/10,
                  marginRight: Dimensions.get("screen").height/10,
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
                    margin: Dimensions.get("screen").height/110,
                    fontSize: 18,
                    justifyContent: "center",
                    margin: Dimensions.get("screen").height/110,
                    fontStyle: "italic",
                    color: 'white',
                  }}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
                
                <View style={{flexDirection: "row", marginLeft: Dimensions.get("screen").height/12}}>
                <Text style={{marginTop: -Dimensions.get("screen").height/100}}>Already have an account?</Text>
                <TouchableOpacity 
                 onPress={() => {
                    navigation.navigate("Login");
                  }}
                style={{color: "black", 
                alignContent: "center", 
                marginRight: Dimensions.get("screen").height/95, 
                }}><Text style={{fontWeight: "bold", fontSize: 18, marginTop: -Dimensions.get("screen").height/80}}>  Login here</Text></TouchableOpacity>
                </View>
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
    marginTop: -Dimensions.get('screen').height/10000,
  },
  body: {
    flex: 8,
    backgroundColor: "rgba(0, 0, 0, 0)",
    flexDirection: "column",
  },

});

export default Signup;
