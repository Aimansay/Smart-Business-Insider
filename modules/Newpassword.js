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

function CheckPassword(inputtxt) { 
  var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  if(inputtxt.match(passw)) { 
    return true;
  } else { 
    alert('Password must contain atleast one uppercase letter, one lower case letter and one number')
    return false;
  }
}

function NewPassword () {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
  
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const ip = await AsyncStorage.getItem('ip');

     const response = await axios.put(`${ip}:3000/api/users/${userId}/newPassword`, {
     newPassword, confirmPassword
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


    return (
      <ImageBackground
        source={require("../assets/signupbackground.png")}
        style={{ flex: 1, height: "100%" }}
      > 
        <View style={{height: "100%", width: 200}}>
        <Text style={{marginLeft: 10,paddingTop: 100, fontSize: 40, color: "white", fontWeight: "bold"}}>New Password</Text>
        </View>
        
        <View style={{paddingTop: 30, marginLeft: 10}}>
            <Text>New Password</Text>
            <View style={{flexDirection: "row"}}>
            <Image
            source={require("../assets/password.png")}
            style={{width: 32,
              height: 32,
              marginTop: 5,
              borderColor: "black", borderBottomWidth: 2,
            }}/>
            <TextInput
                style={{ borderColor: "black", borderBottomWidth: 2, paddingTop: 5,
                fontSize: 25, textShadowColor: "black", width: 350, }}
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
            style={{width: 32,
              height: 32,
              marginTop: 5,
              borderColor: "black", borderBottomWidth: 2,
            }}/>
            <TextInput
                style={{ borderColor: "black", borderBottomWidth: 2, paddingTop: 5,
                fontSize: 25, textShadowColor: "black", width: 350, }}
                placeholder="  Confirm your New Password"
                onChangeText={setConfirmPassword}
              >
              </TextInput>
              </View>
              <TouchableOpacity
                onPress={() => {
                    if (CheckPassword(newPassword )) {
                      if (newPassword === confirmPassword) {
                        handleChangePassword();
                      } else {
                        alert ("Passwords do not match");
                      }
                    }
                  }
                }
                style={{
                  margin: 5,
                  
                  backgroundColor: 'rgb(40,40,40)',
                  fontSize: 50,
                  borderRadius: 15,
                  marginLeft: 100,
                  marginRight: 100,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 50,
                  shadowColor: "black",
                  shadowRadius: 200,
                  shadowOpacity: 200,
                  shadowOffset: {width: 200, height: 200},  
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
                  Save
                </Text>
              </TouchableOpacity>
        </View>
      </ImageBackground>
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
    marginLeft: 10,
  },
  body: {
    flex: 8,
    backgroundColor: "rgba(0, 0, 0, 0)",
    flexDirection: "column",
  },

});

export default NewPassword;
