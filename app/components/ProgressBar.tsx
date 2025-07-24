import React from "react";
import { View } from "react-native";

interface ProgressBarProps {
  progress?: number; // 0 to 1
}

export default function ProgressBar({ progress = 0.2 }: ProgressBarProps) {
  return (
    <View className="mt-16 px-6 items-center">
      <View className="h-2 w-64 bg-accent/15 rounded-full">
        <View
          className="h-2 bg-accent rounded-full"
          style={{ width: `${progress * 100}%` }}
        />
      </View>
    </View>
  );
}
