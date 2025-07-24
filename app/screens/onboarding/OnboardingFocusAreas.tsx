import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ProgressBar from "../../components/ProgressBar";
import Button from "../../components/Button";
import BackButton from "../../components/BackButton";

const FOCUS_AREAS = [
  "Back",
  "Shoulders",
  "Arms",
  "Chest",
  "Abs",
  "Butt",
  "Legs",
  "Full Body",
];

export default function OnboardingFocusAreas() {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  return (
    <View className="flex-1 bg-background justify-between">
      <BackButton />
      <ProgressBar progress={0.2} />
      <View className="flex-1 items-center">
        <View className="mt-16 mb-8">
          <Text
            className="text-3xl text-center text-primary"
            style={{ fontFamily: "Outfit-Bold" }}
          >
            Select the areas you want{"\n"}to focus on
          </Text>
        </View>
        <View className="flex-row flex-wrap justify-center mb-8 gap-3 px-2">
          {FOCUS_AREAS.map((area) => (
            <TouchableOpacity
              key={area}
              className={`px-6 py-3 rounded-full border-2 mb-3 mx-1 ${
                selectedAreas.includes(area)
                  ? "bg-accent border-accent"
                  : "bg-background border-text"
              }`}
              onPress={() => toggleArea(area)}
              activeOpacity={0.85}
            >
              <Text
                className={`text-lg ${selectedAreas.includes(area) ? "text-background" : "text-primary"}`}
                style={{ fontFamily: "Outfit-Bold" }}
              >
                {area}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Placeholder for muscle diagrams */}
        <View className="flex-row justify-center items-center mt-2 mb-4">
          <View
            style={{
              width: 120,
              height: 220,
              backgroundColor: "#6ea49d",
              borderRadius: 16,
              marginRight: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#0e1423" }}>[Front SVG]</Text>
          </View>
          <View
            style={{
              width: 120,
              height: 220,
              backgroundColor: "#6ea49d",
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#0e1423" }}>[Back SVG]</Text>
          </View>
        </View>
      </View>
      <View className="mb-16 items-center">
        <View className="mb-5 w-[370px]">
          <Button
            href="/screens/onboarding/OnboardingHeight"
            disabled={selectedAreas.length === 0}
          >
            Next
          </Button>
        </View>
      </View>
    </View>
  );
}
