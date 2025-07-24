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

export default function OnboardingHeight() {
  const [unit, setUnit] = useState<"cm" | "ft">("cm");
  const [selectedCm, setSelectedCm] = useState<number>(170);

  const scrollRef = useRef<ScrollView>(null);
  const ITEM_HEIGHT = 50;
  const VISIBLE_ITEMS = 7;

  const cmHeights = Array.from({ length: 81 }, (_, i) => 140 + i); // 140–220

  const cmToFtIn = (cm: number) => {
    const inches = cm / 2.54;
    const ft = Math.floor(inches / 12);
    const inch = Math.round(inches % 12);
    return `${ft}′ ${inch}″`;
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(cmHeights.length - 1, index));
    const newSelectedCm = cmHeights[clampedIndex];
    if (newSelectedCm !== selectedCm) {
      setSelectedCm(newSelectedCm);
    }
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(cmHeights.length - 1, index));

    // Snap to the nearest item
    scrollRef.current?.scrollTo({
      y: clampedIndex * ITEM_HEIGHT,
      animated: true,
    });
  };

  // Set initial scroll position
  useEffect(() => {
    const index = cmHeights.indexOf(170);
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: index * ITEM_HEIGHT,
        animated: false,
      });
    }, 100);
  }, []);

  return (
    <View className="flex-1 bg-background justify-between">
      <BackButton />
      <ProgressBar progress={0.4} />

      <View className="flex-1 items-center">
        <View className="mt-16 mb-8">
          <Text
            className="text-3xl text-center text-primary"
            style={{ fontFamily: "Outfit-Bold" }}
          >
            What's Your Height?
          </Text>

          <Text
            className="text-base text-center mt-2 text-text"
            style={{ fontFamily: "Outfit-Regular" }}
          >
            Select your height. This helps us personalize your plan.
          </Text>
        </View>

        {/* Unit toggle */}
        <View className="flex-row mb-6">
          <TouchableOpacity
            onPress={() => setUnit("cm")}
            className={`px-4 py-2 rounded-full ${
              unit === "cm" ? "bg-accent" : "bg-text"
            } mx-2`}
          >
            <Text className="text-background">Metric</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setUnit("ft")}
            className={`px-4 py-2 rounded-full ${
              unit === "ft" ? "bg-accent" : "bg-text"
            } mx-2`}
          >
            <Text className="text-background">Imperial</Text>
          </TouchableOpacity>
        </View>

        {/* Picker */}
        <View className="h-[350px] justify-center overflow-hidden">
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="normal"
            contentContainerStyle={{
              alignItems: "center",
              paddingVertical: ITEM_HEIGHT * ((VISIBLE_ITEMS - 1) / 2),
            }}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleScrollEnd}
            onScrollEndDrag={handleScrollEnd}
            scrollEventThrottle={16}
          >
            {cmHeights.map((height, index) => {
              const idx = index;
              const selectedIdx = cmHeights.indexOf(selectedCm);
              const diff = Math.abs(selectedIdx - idx);

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
                <View key={height} className="my-2">
                  <Text
                    className={`${textSize} ${textColor} ${opacity}`}
                    style={{ fontFamily: "Outfit-Bold" }}
                  >
                    {unit === "cm" ? `${height}` : cmToFtIn(height)}
                  </Text>
                </View>
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
