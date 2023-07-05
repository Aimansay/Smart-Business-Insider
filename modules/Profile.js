import React, {useState} from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ProfilePopupScreen = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handleChangeUsername = async () => {
  
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const ip = await AsyncStorage.getItem('ip');

     const response = await axios.put(`${ip}:3000/api/users/${userId}/changeUsername`, {
     username
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

   const handleChangeEmail = async () => {
  
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const ip = await AsyncStorage.getItem('ip');

     const response = await axios.put(`${ip}:3000/api/users/${userId}/changeEmail`, {
     email
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
    <View style={styles.container}>
      <Modal visible={true} animationType="slide">
        <View style={styles.popup}>
          <Text style={styles.title}>Change Username</Text>
          <Text style={styles.content}>
            Username must be unique
          </Text>
          <View
                style={{ flexDirection: "row", marginTop: 10,fontSize: 20 }}
              >
                <Text style={{ fontSize: 20, marginRight: 10}}>
                  Username:
                </Text>
                <TextInput
                  style={{ borderColor: "black", borderBottomWidth: 2.5, marginRight: 5, fontSize: 10 }}
                  placeholder="New Username"
                  onChangeText={setUsername}
                />
              </View>
        </View>
        <TouchableOpacity
                onPress={handleChangeUsername}
                style={{
                  margin: 20,
                  backgroundColor: "lightgrey",
                  fontSize: 50,
                  borderRadius: 15,
                  marginLeft: 100,
                  marginRight: 100,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                >
                <Text
                  style={{
                    fontSize: 20,
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontStyle: "italic",
                    margin: 10
                  }}
                >
                  Save!
                </Text>
                </TouchableOpacity>
        <View style={styles.popup}>
          <Text style={styles.title}>Email</Text>
          <Text style={styles.content}>
            Enter your new Email
          </Text>
          <View
                style={{ flexDirection: "row", marginTop: 10,fontSize: 20 }}
              >
                <Text style={{ fontSize: 20, marginRight: 10}}>
                  Email:
                </Text>
                <TextInput
                  style={{ borderColor: "black", borderBottomWidth: 2.5, marginRight: 5, fontSize: 10 }}
                  placeholder="New Email"
                  onChangeText={setEmail}
                />
              </View>
                
        </View>
        <TouchableOpacity
                onPress={handleChangeEmail}
                style={{
                  margin: 20,
                  backgroundColor: "lightgrey",
                  fontSize: 50,
                  borderRadius: 15,
                  marginLeft: 100,
                  marginRight: 100,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                >
                <Text
                  style={{
                    fontSize: 20,
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontStyle: "italic",
                    margin: 10
                  }}
                >
                  Save!
                </Text>
                </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  popup: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    margin: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    marginBottom: 20,
  },
  
});

export default ProfilePopupScreen;
