import React, { useState } from "react";
import { View, SafeAreaView, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import profile from '../assets/profilePic.jpg';
import home from '../assets/home.png';
import analytics from '../assets/analytics.png';
import inventory from '../assets/inventory.png';
import billing from '../assets/billing.png';
import settings from '../assets/settings.png';
import logout from '../assets/logout.png';
import record from '../assets/billing.png';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import User from "./User";

export default function NaviagtionScreen(props) {
    const navigation = useNavigation();
    const [currentTab, setCurrentTab] = useState(props.Title);
    return (
        <SafeAreaView style={styles.container}>
            <View style={{justifyContent: 'flex-start', padding: 20, marginTop: 40,}}>
                <Image source = {User.image ? {uri: User.image} :  profile} style={{
                    width: 80,
                    height: 80,
                    borderRadius: 10,
                    marginTop: 8
                }} ></Image>
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'white',
                    marginTop: 5
                }}>{User.Name}</Text>
                <TouchableOpacity onPress={() => {navigation.navigate("Settings")}}>
                    <Text style={{
                        marginTop: 6,
                        color: 'white',
                    }}>View Profile</Text>
                </TouchableOpacity>
                <View styles={{ flexGrow: 1, marginTop: 50}}>
                    {

                    }

                    {TabButton(currentTab, setCurrentTab, "Homepage", home, navigation)}
                    {TabButton(currentTab, setCurrentTab, "Analytics", analytics, navigation)}
                    {TabButton(currentTab, setCurrentTab, "Inventory", inventory, navigation)}
                    {TabButton(currentTab, setCurrentTab, "Billing", billing, navigation)}
                    {TabButton(currentTab, setCurrentTab, "Record", record, navigation)}
                    {TabButton(currentTab, setCurrentTab, "Settings", settings, navigation)}
                </View>
                <View style={{
                    marginTop: 120,
                }}>
                    {TabButton(currentTab, setCurrentTab, "Logout", logout, navigation)}
                </View>
            </View>
        </SafeAreaView>
    );
}

const TabButton = (currentTab, setCurrentTab, title, image, navigation) => {
    return (
        <TouchableOpacity onPress={() => {
            if (title == "Logout") {
                if (!User.fingerprint) {
                AsyncStorage.removeItem("token");
                AsyncStorage.removeItem("userId");
                }
                setCurrentTab("Login")
                navigation.navigate("Login");
                navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'Login' }]
                    })
                  );
            }else {
            navigation.navigate(title);
            navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: title }],
                })
              );
            }
        }}>
            <View style={{
                flexDirection: "row",
                alignItems: 'center',
                paddingVertical: 10,
                backgroundColor: currentTab == title ? "white" : "transparent",
                paddingRight: 30,
                borderRadius: 8, marginTop: 20,
                width: 150,
            }}>
                <Image source={image} style={{
                    marginLeft: 6,
                    width: 25, height: 25,
                    tintColor: currentTab == title ? "rgb(50,50,50)" : "white"
                }}></Image>
                <Text style={{
                    fontSize: 15, 
                    fontWeight: 'bold',
                    paddingLeft: 15,
                    color: currentTab == title ? "rgb(50,50,50)" : "white"
                }}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
   container : {
        backgroundColor: "rgb(50,50,50)",
        height: '100%'
   } 
});