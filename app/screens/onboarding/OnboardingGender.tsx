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
    <View className="flex-1 bg-white px-6">
      <BackButton />
      <ProgressBar progress={0.2} />
      <View>
        <Text
          className="text-3xl text-center mt-14 mb-8 text-black"
          style={{ fontFamily: "Outfit-Bold" }}
        >
          What's your gender?
        </Text>
        <View className="flex-row justify-center mb-8">
          {/* Male Card */}
          <TouchableOpacity
            className={`items-center mx-4 p-2 rounded-2xl border-2 ${
              selectedGender === "male"
                ? "border-accent bg-accent/10"
                : "border-gray-200 bg-white"
            }`}
            onPress={() => setSelectedGender("male")}
            activeOpacity={0.8}
          >
            <FontAwesome5
              name="male"
              size={100}
              color={selectedGender === "male" ? "#00C781" : "black"}
            />
          </TouchableOpacity>
          {/* Female Card */}
          <TouchableOpacity
            className={`items-center mx-4 p-2 rounded-2xl border-2 ${
              selectedGender === "female"
                ? "border-accent bg-accent/10"
                : "border-gray-200 bg-white"
            }`}
            onPress={() => setSelectedGender("female")}
            activeOpacity={0.8}
          >
            <FontAwesome5
              name="female"
              size={100}
              color={selectedGender === "female" ? "#00C781" : "black"}
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
