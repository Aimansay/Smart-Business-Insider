import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import User from "./User";

WebBrowser.maybeCompleteAuthSession();

const WelcomeScreen = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "811022984303-tu00j4m89lm3bhq33vso6d02tiaucggf.apps.googleusercontent.com",
    expoClientId: "811022984303-08uavm3s0pq0t6u12tm5tbvmcujkeei5.apps.googleusercontent.com",
    clientId: "811022984303-q9fpqtuf82fejnndj6ia65i7hl63cr5u.apps.googleusercontent.com",
  });

  const navigation = useNavigation();

  useEffect(() => {
    if (response?.type === "success") {
      try {
        setAccessToken(response.authentication.accessToken);
        accessToken && fetchUserInfo();
      } catch (error) {
        Alert.alert("Sign in Failed", "Sign in failed please try again.", [{ text: "OK" }]);
      }
    } else if (response?.type === "cancel" || response?.type === "dismiss") {
      Alert.alert("Sign in Failed", "Sign in failed please try again.", [{ text: "OK" }]);
    }
  }, [response, accessToken]);

  async function fetchUserInfo() {
    setLoading(true); // Start loading

    try {
      let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
      const useInfo = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(useInfo));
      User.Name = useInfo.given_name;
      User.image = useInfo.picture;
      console.log(User.Name);
      console.log(useInfo);
      navigation.navigate("Homepage");
    } catch (error) {
      console.log(error);
      Alert.alert("Fetch User Info Failed", "Failed to fetch user info.", [{ text: "OK" }]);
    } finally {
      setLoading(false); // Stop loading
    }
  }

  return (
    <ImageBackground
      source={require("../assets/introbackground.jpeg")}
      style={{ flex: 1, height: "100%" }}
    >
      <View
        style={[
          styles.box,
          {
            transform: [{ rotate: "33deg" }],
          },
        ]}
      >
        <Text style={{ fontWeight: "bold", fontSize: 30 }}>Smart Business Insider</Text>
      </View>
      <View>
        <Text style={{ fontSize: 35, color: "white", marginLeft: Dimensions.get("screen").height / 100 }}>Welcome</Text>
        <Text style={{ fontSize: 25, color: "white", marginLeft: Dimensions.get("screen").height / 100, width: 250, paddingTop: 10 }}>
          Get started bycreating your account
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Signup");
          }}
          style={{
            margin: Dimensions.get("screen").height / 45,
            backgroundColor: "rgb(40,40,40)",
            fontSize: 50,
            borderRadius: 15,
            marginLeft: Dimensions.get("screen").height / 30,
            marginRight: Dimensions.get("screen").height / 30,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 150,
          }}
        >
          <Text
            style={{
              margin: Dimensions.get("screen").height / 75,
              fontSize: 20,
              justifyContent: "center",
              margin: Dimensions.get("screen").height / 75,
              fontStyle: "italic",
              color: "white",
            }}
          >
            Sign Up
          </Text>
        </TouchableOpacity>
        <View>
          <TouchableOpacity
            onPress={() => {
              promptAsync();
              // navigation.navigate("Signup");
            }}
            style={{
              flexDirection: "row",
              margin: Dimensions.get("screen").height / 45,
              backgroundColor: "rgb(90,90,90)",
              borderRadius: 15,
              marginLeft: Dimensions.get("screen").height / 30,
              marginRight: Dimensions.get("screen").height / 30,
              justifyContent: "center",
              alignItems: "center",
              marginTop: -10,
            }}
          >
            <Image
              source={require("../assets/google.png")}
              style={{
                width: Dimensions.get("screen").width / 12.5,
                height: Dimensions.get("screen").height / 24,
              }}
            />
            <Text
              style={{
                margin: Dimensions.get("screen").height / 75,
                fontSize: 18,
                justifyContent: "center",
                color: "white",
              }}
            >
              Continue with Google
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Login");
          }}
          style={{
            margin: Dimensions.get("screen").height / 45,
            fontSize: 50,
            borderRadius: 15,
            marginLeft: Dimensions.get("screen").height / 30,
            marginRight: Dimensions.get("screen").height / 30,
            justifyContent: "center",
            alignItems: "center",
            marginTop: -10,
            shadowColor: "black",
          }}
        >
          <Text
            style={{
              margin: Dimensions.get("screen").height / 110,
              fontSize: 18,
              justifyContent: "center",
              color: "white",
            }}
          >
            Log In
          </Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    marginTop: Dimensions.get("screen").height / 5,
    marginStart: Dimensions.get("screen").height / 14,
    height: Dimensions.get("screen").height / 13,
    width: Dimensions.get("screen").width / 1.19,
    borderRadius: 5,
    marginVertical: 40,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default WelcomeScreen;
