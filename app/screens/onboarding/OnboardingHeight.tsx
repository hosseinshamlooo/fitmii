import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import BackButton from "../../components/BackButton";
import ProgressBar from "../../components/ProgressBar";
import Button from "../../components/Button";

export default function OnboardingHeight() {
  const [unit, setUnit] = useState<"cm" | "ft">("cm");
  const [selectedCm, setSelectedCm] = useState<number>(170);

  const cmHeights = Array.from({ length: 81 }, (_, i) => 140 + i); // 140–220

  const cmToFtIn = (cm: number) => {
    const inches = cm / 2.54;
    const ft = Math.floor(inches / 12);
    const inch = Math.round(inches % 12);
    return `${ft}′ ${inch}″`;
  };

  const displayValue =
    unit === "cm" ? `${selectedCm} cm` : cmToFtIn(selectedCm);

  return (
    <View className="flex-1 bg-white justify-between">
      <BackButton />
      <ProgressBar progress={0.4} />

      <View className="flex-1 items-center justify-center">
        <Text
          className="text-3xl text-black mb-2"
          style={{ fontFamily: "Outfit-Bold" }}
        >
          What's Your Height?
        </Text>
        <Text className="text-sm text-gray-400 text-center"></Text>
        <Text
          className="text-base text-center mb-8 text-gray-700"
          style={{ fontFamily: "Outfit-Regular" }}
        >
          Select your height. This helps us personalize your plan.
        </Text>

        <View className="flex-row mb-6">
          <TouchableOpacity
            onPress={() => setUnit("cm")}
            className={`px-4 py-2 rounded-full ${
              unit === "cm" ? "bg-purple-600" : "bg-gray-700"
            } mx-2`}
          >
            <Text className="text-white">CM</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setUnit("ft")}
            className={`px-4 py-2 rounded-full ${
              unit === "ft" ? "bg-purple-600" : "bg-gray-700"
            } mx-2`}
          >
            <Text className="text-white">FT/IN</Text>
          </TouchableOpacity>
        </View>

        <View className="h-64 justify-center">
          <ScrollView
            showsVerticalScrollIndicator={false}
            snapToInterval={50}
            decelerationRate="fast"
            contentContainerStyle={{ alignItems: "center" }}
          >
            {cmHeights.map((height) => {
              const isSelected = height === selectedCm;
              return (
                <TouchableOpacity
                  key={height}
                  onPress={() => setSelectedCm(height)}
                  className="my-2"
                >
                  <Text
                    className={`${
                      isSelected
                        ? "text-purple-500 text-4xl"
                        : "text-gray-500 text-2xl"
                    }`}
                    style={{ fontFamily: "Outfit-Bold" }}
                  >
                    {unit === "cm" ? `${height}` : cmToFtIn(height)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      <View className="mb-16 items-center">
        <View className="mb-5 w-[370px]">
          <Button
            href="/screens/onboarding/OnboardingWeight"
            disabled={!selectedCm}
          >
            Continue
          </Button>
        </View>
      </View>
    </View>
  );
}
