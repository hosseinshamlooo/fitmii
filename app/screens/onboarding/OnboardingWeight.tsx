import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import BackButton from "../../components/BackButton";
import ProgressBar from "../../components/ProgressBar";
import Button from "../../components/Button";

export default function OnboardingWeight() {
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const [selectedWeight, setSelectedWeight] = useState<number>(70);

  const scrollRef = useRef<ScrollView>(null);
  const ITEM_WIDTH = 60;

  const kgWeights = Array.from({ length: 145 }, (_, i) => 36 + i); // 36–180 kg

  const kgToLbs = (kg: number) => Math.round(kg * 2.20462);
  const lbsToKg = (lbs: number) => Math.round(lbs / 2.20462);

  // Mock height from previous screen (you'll need to get this from your navigation state)
  const selectedHeight = 170; // cm

  const calculateBMI = (weightKg: number, heightCm: number) => {
    const heightM = heightCm / 100;
    return (weightKg / (heightM * heightM)).toFixed(1);
  };

  const getBMIMessage = (bmi: number) => {
    if (bmi < 18.5) return "You're underweight. Consider gaining some weight.";
    if (bmi < 25) return "You've got a great figure! Keep it up!";
    if (bmi < 30) return "You're overweight. Consider losing some weight.";
    return "You're obese. Consider significant weight loss.";
  };

  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return "text-orange-600"; // Underweight - dark orange
    if (bmi < 25) return "text-green-600"; // Healthy - dark green
    if (bmi < 30) return "text-orange-600"; // Overweight - dark orange
    return "text-red-600"; // Obese - dark red
  };

  const lbsWeights = Array.from({ length: 321 }, (_, i) => 80 + i); // 80–400 lbs (80 at index 0)

  // Debug: log the first few lbs values
  console.log("Lbs array starts with:", lbsWeights.slice(0, 10));

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const centerOffset = unit === "kg" ? -2 : -6; // Different offset for lbs
    const index = Math.round(offsetX / ITEM_WIDTH) + centerOffset;
    const currentWeights = unit === "kg" ? kgWeights : lbsWeights;
    const clampedIndex = Math.max(
      0,
      Math.min(currentWeights.length - 1, index)
    );
    const newWeight = currentWeights[clampedIndex];
    setSelectedWeight(newWeight);
  };

  // Set initial scroll position
  useEffect(() => {
    const index = kgWeights.indexOf(70);
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        x: index * ITEM_WIDTH,
        animated: false,
      });
    }, 100);
  }, []);

  // Update scroll position when unit changes
  useEffect(() => {
    if (unit === "kg") {
      const index = kgWeights.indexOf(selectedWeight);
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          x: index * ITEM_WIDTH,
          animated: true,
        });
      }, 50);
    } else {
      // For lbs, show index 75 (155lbs) in the center
      const centerIndex = 75;
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          x: centerIndex * ITEM_WIDTH,
          animated: true,
        });
      }, 50);
    }
  }, [unit]);

  return (
    <View className="flex-1 bg-background justify-between">
      <BackButton />
      <ProgressBar progress={0.6} />

      <View className="flex-1 items-center">
        <View className="mt-16 mb-8">
          <Text
            className="text-3xl text-center text-primary"
            style={{ fontFamily: "Outfit-Bold" }}
          >
            What's Your Weight?
          </Text>

          <Text
            className="text-base text-center mt-2 text-text"
            style={{ fontFamily: "Outfit-Regular" }}
          >
            Select your weight. This helps us personalize your plan.
          </Text>
        </View>

        {/* Unit toggle */}
        <View className="flex-row mb-6 bg-accent/15 rounded-full p-1">
          <TouchableOpacity
            onPress={() => setUnit("kg")}
            className={`px-6 py-2 rounded-full ${
              unit === "kg" ? "bg-accent" : "bg-transparent"
            }`}
          >
            <Text
              className={unit === "kg" ? "text-background" : "text-text"}
              style={{ fontFamily: "Outfit-SemiBold" }}
            >
              kg
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setUnit("lbs")}
            className={`px-6 py-2 rounded-full ${
              unit === "lbs" ? "bg-accent" : "bg-transparent"
            }`}
          >
            <Text
              className={unit === "lbs" ? "text-background" : "text-text"}
              style={{ fontFamily: "Outfit-SemiBold" }}
            >
              lbs
            </Text>
          </TouchableOpacity>
        </View>

        {/* Picker */}
        <View className="h-[200px] justify-end overflow-hidden relative w-96">
          <ScrollView
            ref={scrollRef}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            decelerationRate="normal"
            contentContainerStyle={{
              alignItems: "center",
              paddingHorizontal: ITEM_WIDTH * 2,
            }}
            onScroll={handleScroll}
            scrollEventThrottle={unit === "kg" ? 8 : 4}
            bounces={false}
            overScrollMode="never"
          >
            {(unit === "kg" ? kgWeights : lbsWeights).map((weight, index) => {
              const currentWeights = unit === "kg" ? kgWeights : lbsWeights;
              const selectedIdx = currentWeights.indexOf(selectedWeight);
              const diff = Math.abs(selectedIdx - index);

              // Debug: log the selection
              if (index === selectedIdx) {
                console.log(`Selected: ${weight}${unit} at index ${index}`);
              }

              let textSize = "text-4xl";
              let textColor = "text-text";
              let opacity = "opacity-50";

              if (diff === 0) {
                textSize = "text-5xl";
                textColor = "text-accent";
                opacity = "opacity-100";
              } else if (diff === 1) {
                opacity = "opacity-80";
              } else if (diff === 2) {
                opacity = "opacity-60";
              } else if (diff === 3) {
                opacity = "opacity-40";
              }

              return (
                <View key={weight} className="mx-3 items-center">
                  <Text
                    className={`${textSize} ${textColor} ${opacity}`}
                    style={{ fontFamily: "Outfit-Bold" }}
                  >
                    {weight}
                  </Text>
                </View>
              );
            })}
          </ScrollView>

          {/* Triangle Indicator */}
          <View
            className="absolute bottom-4 self-center"
            style={{
              width: 0,
              height: 0,
              backgroundColor: "transparent",
              borderStyle: "solid",
              borderLeftWidth: 8,
              borderRightWidth: 8,
              borderBottomWidth: 12,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderBottomColor: "#17e1c5",
            }}
          />
        </View>

        {/* BMI Display */}
        <View className="bg-primary rounded-xl p-6 mb-6 w-96 shadow-sm border-2 border-accent">
          <View className="flex-row items-center justify-between mb-3">
            <Text
              className="text-xl text-background"
              style={{ fontFamily: "Outfit-Bold" }}
            >
              YOUR CURRENT BMI
            </Text>
            <View className="w-6 h-6 bg-accent rounded-full items-center justify-center">
              <Text className="text-xs text-background">i</Text>
            </View>
          </View>
          <View className="flex-row items-center justify-between">
            <Text
              className={`text-4xl ${getBMIColor(parseFloat(calculateBMI(selectedWeight, selectedHeight)))}`}
              style={{ fontFamily: "Outfit-Bold" }}
            >
              {calculateBMI(selectedWeight, selectedHeight)}
            </Text>
            <Text
              className="text-base text-background flex-1 ml-4"
              style={{ fontFamily: "Outfit-Regular" }}
            >
              {getBMIMessage(
                parseFloat(calculateBMI(selectedWeight, selectedHeight))
              )}
            </Text>
          </View>
        </View>
      </View>

      <View className="mb-16 items-center">
        <View className="mb-5 w-[370px]">
          <Button
            href="/screens/dashboard/Dashboard"
            disabled={!selectedWeight}
          >
            Continue
          </Button>
        </View>
      </View>
    </View>
  );
}
