import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProgressBar from "../../components/ProgressBar";
import Button from "../../components/Button";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import BackButton from "../../components/BackButton";

const GOALS = [
  {
    key: "muscle",
    label: "Muscle Gain",
    description: "Focus on muscle mass & size growth",
    emoji: "💪",
  },
  {
    key: "endurance",
    label: "Endurance",
    description: "",
    emoji: "🔋",
  },
  {
    key: "strength",
    label: "Max Strength",
    description: "",
    emoji: "🔥",
  },
  {
    key: "toned",
    label: "Get Toned",
    description: "",
    emoji: "😁",
  },
];

export default function OnboardingGoal() {
  const [selectedGoal, setSelectedGoal] = useState<
    "muscle" | "endurance" | "strength" | "toned" | null
  >(null);
  const navigation = useNavigation();
  const progressAnim = useRef(new Animated.Value(0.2)).current;
  const [progress, setProgress] = useState(0.2);

  // Animate progress bar to 0.4 (40%)
  useEffect(() => {
    const id = progressAnim.addListener(({ value }) => setProgress(value));
    Animated.timing(progressAnim, {
      toValue: 0.4,
      duration: 600,
      useNativeDriver: false,
    }).start();
    return () => progressAnim.removeListener(id);
  }, []);

  const handleNext = () => {
    if (selectedGoal) {
      // navigation.navigate('NextOnboardingScreen', { goal: selectedGoal });
    }
  };

  // For consistent question Y position, match the margin from gender page (mt-6 mb-8)
  return (
    <View className="flex-1 bg-background justify-between">
      {/* Back Arrow */}
      <BackButton />
      {/* Animated Progress Bar */}
      <ProgressBar progress={progress} />
      {/* Content */}
      <View className="flex-1 items-center">
        <View className="mt-16 mb-8">
          <Text
            className="text-3xl text-center text-primary"
            style={{ fontFamily: "Outfit-Bold" }}
          >
            What's your goal?
          </Text>
          <Text
            className="text-base text-center mt-2 text-text"
            style={{ fontFamily: "Outfit-Regular" }}
          >
            Your coach will design your{`\n`}workouts that best suit your goal
          </Text>
        </View>
        <View className="w-full px-4">
          {GOALS.map((goal) => (
            <TouchableOpacity
              key={goal.key}
              className={`flex-row items-center rounded-2xl border-2 mb-4 px-4 py-4 bg-background ${
                selectedGoal === goal.key
                  ? "border-accent bg-accent/5"
                  : "border-text"
              }`}
              onPress={() => setSelectedGoal(goal.key as any)}
              activeOpacity={0.85}
            >
              <Text style={{ fontSize: 28, marginRight: 16 }}>
                {goal.emoji}
              </Text>
              <View className="flex-1">
                <Text
                  className="text-lg text-primary"
                  style={{ fontFamily: "Outfit-Bold" }}
                >
                  {goal.label}
                </Text>
                {goal.description ? (
                  <Text
                    className="text-text text-base"
                    style={{ fontFamily: "Outfit-Regular" }}
                  >
                    {goal.description}
                  </Text>
                ) : null}
              </View>
              {selectedGoal === goal.key && (
                <View className="ml-2">
                  <FontAwesome name="check-circle" size={24} color="#17e1c5" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {/* Next Button */}
      <View className="mb-16 items-center">
        <View className="mb-5 w-[370px]">
          <Button
            href="/screens/onboarding/OnboardingFocusAreas"
            disabled={!selectedGoal}
          >
            Next
          </Button>
        </View>
      </View>
    </View>
  );
}
