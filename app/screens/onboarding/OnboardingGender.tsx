import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function OnboardingGender() {
  const [selectedGender, setSelectedGender] = useState<
    "male" | "female" | null
  >(null);
  const navigation = useNavigation();

  const handleNext = () => {
    if (selectedGender) {
      // Navigate to next onboarding step, pass gender if needed
      // navigation.navigate('NextOnboardingScreen', { gender: selectedGender });
    }
  };

  return (
    <View className="flex-1 bg-white justify-between">
      {/* Progress Bar */}
      <View className="mt-8 px-6">
        <View className="h-2 w-full bg-gray-200 rounded-full">
          <View
            className="h-2 bg-blue-500 rounded-full"
            style={{ width: "20%" }}
          />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-center mt-6 mb-8">
          What's your gender?
        </Text>
        <View className="flex-row justify-center mb-8">
          {/* Male Card */}
          <TouchableOpacity
            className={`items-center mx-4 p-2 rounded-2xl border-2 ${selectedGender === "male" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}`}
            onPress={() => setSelectedGender("male")}
            activeOpacity={0.8}
          >
            <FontAwesome5
              name="male"
              size={100}
              color={selectedGender === "male" ? "#2563eb" : "black"}
            />
            <Text className="mt-2 text-lg font-semibold">Male</Text>
          </TouchableOpacity>
          {/* Female Card */}
          <TouchableOpacity
            className={`items-center mx-4 p-2 rounded-2xl border-2 ${selectedGender === "female" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}`}
            onPress={() => setSelectedGender("female")}
            activeOpacity={0.8}
          >
            <FontAwesome5
              name="female"
              size={100}
              color={selectedGender === "female" ? "#2563eb" : "black"}
            />
            <Text className="mt-2 text-lg font-semibold">Female</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Next Button */}
      <View className="px-4 mb-4">
        <TouchableOpacity
          className={`w-full py-4 rounded-xl ${selectedGender ? "bg-blue-600" : "bg-blue-300"}`}
          disabled={!selectedGender}
          onPress={handleNext}
          activeOpacity={selectedGender ? 0.8 : 1}
        >
          <Text className="text-center text-lg font-bold text-white">Next</Text>
        </TouchableOpacity>
        {/* Existing User Link */}
        <View className="flex-row items-center justify-center mt-4">
          <Text className="text-gray-500 mr-1">Already our user?</Text>
          <TouchableOpacity
            onPress={() => {
              /* navigation.navigate('SignIn') */
            }}
          >
            <Text className="text-black underline font-medium">
              Continue with your existing account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
