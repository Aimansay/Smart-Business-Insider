import React, {useState} from "react";
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
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

function CheckPassword(inputtxt) { 
  var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  if(inputtxt.match(passw)) { 
    return true;
  } else { 
    alert('Password must contain atleast one uppercase letter, one lower case letter and one number')
    return false;
  }
}

const ChangePassword = () => {

   const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = async () => {
  
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        const ip = await AsyncStorage.getItem('ip');

       const response = await axios.put(`${ip}:3000/api/users/${userId}/changePassword`, {
       oldPassword, newPassword, confirmPassword
     }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
        console.log(response.data)
        navigation.navigate("Settings")

      } catch (error) {
         console.log(error)
      }   
     };
 

    const navigation = useNavigation();
    return (
      <KeyboardAwareScrollView style={{flex: 1, height:"100%"}}>
      <ImageBackground
        source={require("../assets/signupbackground.png")}
        style={{ flex: 1, height: "140%" }}
      > 
        <View style={{height: Dimensions.get("screen").height/3, width: Dimensions.get("screen").width/2}}>
        <Text style={{marginLeft: Dimensions.get("screen").height/75,paddingTop: 180, fontSize: 40, color: "white", fontWeight: "bold"}}>Change Password</Text>
        </View>
        <View style={{paddingTop: 10, marginLeft:  Dimensions.get("screen").height/75}}>
            <Text style={{marginTop: 60}}>Old Password</Text>
            <View style={{flexDirection: "row"}}>
            <Image
            source={require("../assets/password.png")}
            style={{width: Dimensions.get("screen").width/12.5,
            height: Dimensions.get("screen").height/24,
            marginTop: Dimensions.get("screen").height/255,
              borderColor: "black", borderBottomWidth: 2,
            }}/>
            <TextInput
                style={{ borderColor: "black", borderBottomWidth: 2, paddingTop: 5,
                fontSize: 15, textShadowColor: "black", width: Dimensions.get("screen").width/1.18 }}
                secureTextEntry={true}
                placeholder="  Enter your Old Password"
                onChangeText={setOldPassword}
              >
              </TextInput>
              </View>
              </View>
        <View style={{paddingTop: 30, marginLeft: Dimensions.get("screen").height/75}}>
            <Text>New Password</Text>
            <View style={{flexDirection: "row"}}>
            <Image
            source={require("../assets/password.png")}
            style={{width: Dimensions.get("screen").width/12.5,
            height: Dimensions.get("screen").height/24,
            marginTop: Dimensions.get("screen").height/255,
              borderColor: "black", borderBottomWidth: 2,
            }}/>
            <TextInput
                style={{ borderColor: "black", borderBottomWidth: 2, paddingTop: 5,
                fontSize: 15, textShadowColor: "black", width: Dimensions.get("screen").width/1.18  }}
                secureTextEntry={true}
                placeholder="  Enter your New Password"
                onChangeText={setNewPassword}
              >
              </TextInput>
              </View>
              </View>
        <View style={{paddingTop: 30, marginLeft: 10}}>
            <Text>Confirm Password</Text>
            <View style={{flexDirection: "row"}}>
            <Image
            source={require("../assets/password.png")}
            style={{width: Dimensions.get("screen").width/12.5,
            height: Dimensions.get("screen").height/24,
            marginTop: Dimensions.get("screen").height/255,
              borderColor: "black", borderBottomWidth: 2,
            }}/>
            <TextInput
                style={{ borderColor: "black", borderBottomWidth: 2, paddingTop: 5,
                fontSize: 15, textShadowColor: "black", width: Dimensions.get("screen").width/1.18 }}
                secureTextEntry={true}
                placeholder="  Confirm your New Password"
                onChangeText={setConfirmPassword}
              >
              </TextInput>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (CheckPassword(newPassword)) {
                    if (newPassword === confirmPassword) {
                      handleChangePassword();
                    } else {
                      alert("Passwords do not match!");
                    }
                  }
                }}
                style={{
                  margin: Dimensions.get("screen").height/45,
                  
                  backgroundColor: 'rgb(40,40,40)',
                  borderRadius: 15,
                  marginLeft: Dimensions.get("screen").height/10,
                  marginRight: Dimensions.get("screen").height/10,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 50,
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
                  Save
                </Text>
              </TouchableOpacity>
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

export default ChangePassword;
