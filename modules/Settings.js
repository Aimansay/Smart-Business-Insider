import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Button,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import NaviagtionScreen from "./NavigationScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Settings = () => {
  const navigation = useNavigation();
  const [showMenu, setShowMenu] = useState(false);
  const offsetValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const closeButtonOffset = useRef(new Animated.Value(0)).current;

  const handleNavigation = useCallback(() => {
    if (showMenu) setShowMenu(false);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", handleNavigation);
    return unsubscribe;
  }, [navigation, handleNavigation]);

  const toggleMenu = () => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: showMenu ? 1 : 0.78,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(offsetValue, {
        toValue: showMenu ? 0 : 220,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(closeButtonOffset, {
        toValue: !showMenu ? -30 : 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setShowMenu(!showMenu);
  };

  return (
    <View style={styles.container}>
      <NaviagtionScreen Title="Settings" />

      <Animated.View
        style={[
          styles.menuContainer,
          {
            transform: [
              { scale: scaleValue },
              { translateX: offsetValue },
            ],
            overflow: showMenu ? "visible" : "hidden",
          },
        ]}
      >
        <View style={styles.header}>
          <ImageBackground
            source={require("../assets/header.png")}
            style={styles.headerBackground}
          >
            <TouchableOpacity onPress={toggleMenu}>
              <Image
                source={
                  showMenu
                    ? require("../assets/closeMenu.png")
                    : require("../assets/menu.png")
                }
                style={styles.menuIcon}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Settings</Text>
          </ImageBackground>
        </View>

        <View style={styles.body}>
          <Image
            source={require("../assets/profilePic.jpg")}
            style={styles.profilePic}
          />
          <View></View>
          <TouchableOpacity style={{
            marginVertical: 15,
            backgroundColor: "grey",
            borderRadius: 15,
            paddingHorizontal: 20,
            paddingVertical: 10,
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            marginTop: '-7%'
          }}>
          <Text style={{color: 'white', fontSize: 15, fontWeight: 'bold'}}>Change</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ProfileScreen");
            }}
            style={styles.button 
            }
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Edit Business Name</Text>
              <Image
                source={require("../assets/arroww.png")}
                style={[styles.buttonIcon, {marginLeft: "43%"}]}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ChangePassword");
            }}
            style={styles.button}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Change Password</Text>
              <Image
                source={require("../assets/arroww.png")}
                style={styles.buttonIcon}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
                AsyncStorage.setItem('fingerprint', 'true');
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Enable Fingerprint</Text>
          </TouchableOpacity>
          <TouchableOpacity
        onPress={() => {
          navigation.navigate("add_item");
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Contact Us</Text>
      </TouchableOpacity>
    </View>
  </Animated.View>
</View>
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

export default Settings;
