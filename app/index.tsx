import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import Button from "./components/Button";

const Home = () => {
  return (
    <SafeAreaView className="flex-1 bg-background justify-between px-6">
      <View className="flex-1 justify-center items-center">
        {/* Placeholder Avatar */}
        <View className="w-28 h-28 bg-accent rounded-full mb-8 justify-center items-center shadow-lg">
          <Text
            className="text-4xl text-background"
            style={{ fontFamily: "Outfit-Bold" }}
          >
            🏋️‍♂️
          </Text>
        </View>
        {/* Headline */}
        <Text
          className="text-4xl text-center text-primary mb-2"
          style={{ fontFamily: "Outfit-Bold" }}
        >
          Level Up Your Real Life.
        </Text>
        {/* Short Subheading */}
        <Text
          className="text-xl text-center text-text mb-10"
          style={{ fontFamily: "Outfit-Regular" }}
        >
          Transform your fitness journey.{"\n"}Get smarter, stronger, every day.
        </Text>
      </View>
      {/* Buttons at the bottom */}
      <View className="w-full mb-6">
        <Button href="/screens/onboarding/OnboardingGender" className="mb-3">
          Get Started
        </Button>
        <TouchableOpacity className="border-2 border-accent py-4 rounded-full w-full">
          <Text
            className="text-accent text-center text-lg"
            style={{ fontFamily: "Outfit-Bold" }}
          >
            Log in
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;
