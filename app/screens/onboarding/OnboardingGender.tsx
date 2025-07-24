import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Button from "../../components/Button";
import ProgressBar from "../../components/ProgressBar";
import BackButton from "../../components/BackButton";

export default function OnboardingGender() {
  const [selectedGender, setSelectedGender] = useState<
    "male" | "female" | null
  >(null);
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-background px-6">
      <BackButton />
      <ProgressBar progress={0.2} />
      <View className="flex-1 items-center">
        <View className="mt-16 mb-8">
          <Text
            className="text-3xl text-center text-primary"
            style={{ fontFamily: "Outfit-Bold" }}
          >
            What's your gender?
          </Text>
        </View>
        <View className="flex-row justify-center mb-8">
          {/* Male Card */}
          <TouchableOpacity
            className={`items-center mx-4 p-2 rounded-2xl border-2 ${
              selectedGender === "male"
                ? "border-accent bg-accent/10"
                : "border-text bg-background"
            }`}
            onPress={() => setSelectedGender("male")}
            activeOpacity={0.8}
          >
            <FontAwesome5
              name="male"
              size={100}
              color={selectedGender === "male" ? "#17e1c5" : "#6ea49d"}
            />
          </TouchableOpacity>
          {/* Female Card */}
          <TouchableOpacity
            className={`items-center mx-4 p-2 rounded-2xl border-2 ${
              selectedGender === "female"
                ? "border-accent bg-accent/10"
                : "border-text bg-background"
            }`}
            onPress={() => setSelectedGender("female")}
            activeOpacity={0.8}
          >
            <FontAwesome5
              name="female"
              size={100}
              color={selectedGender === "female" ? "#17e1c5" : "#6ea49d"}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-1" />
      <View className="mb-16 items-center">
        <View className="mb-5 w-[370px]">
          <Button
            href="/screens/onboarding/OnboardingGoal"
            disabled={!selectedGender}
          >
            Next
          </Button>
        </View>
      </View>
    </View>
  );
}
