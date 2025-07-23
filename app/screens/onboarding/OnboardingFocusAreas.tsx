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
    <View className="flex-1 bg-white justify-between">
      <BackButton />
      <ProgressBar progress={0.2} />
      <View className="flex-1 items-center justify-center">
        <Text
          className="text-3xl text-center mb-8 text-black"
          style={{ fontFamily: "Outfit-Bold" }}
        >
          Select the areas you want{"\n"}to focus on
        </Text>
        <View className="flex-row flex-wrap justify-center mb-8 gap-2 px-2">
          {FOCUS_AREAS.map((area) => (
            <TouchableOpacity
              key={area}
              className={`px-6 py-3 rounded-full border-2 mb-2 mx-1 ${
                selectedAreas.includes(area)
                  ? "bg-accent border-accent"
                  : "bg-white border-gray-300"
              }`}
              onPress={() => toggleArea(area)}
              activeOpacity={0.85}
            >
              <Text
                className={`text-lg ${selectedAreas.includes(area) ? "text-white" : "text-black"}`}
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
              backgroundColor: "#eee",
              borderRadius: 16,
              marginRight: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#bbb" }}>[Front SVG]</Text>
          </View>
          <View
            style={{
              width: 120,
              height: 220,
              backgroundColor: "#eee",
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#bbb" }}>[Back SVG]</Text>
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
