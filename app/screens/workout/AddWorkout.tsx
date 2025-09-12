import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const AddWorkout = ({ onBack }: { onBack: () => void }) => {
  // Handle device back button
  useEffect(() => {
    const backAction = () => {
      onBack();
      return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [onBack]);

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="px-4 pt-2 pb-4 border-b border-gray-800">
        <View className="flex-row items-center justify-end">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity>
              <Ionicons name="calendar" size={24} color="#17e1c5" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="add" size={24} color="#17e1c5" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={24} color="#17e1c5" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Date Navigation */}
      <View className="px-4 py-3 border-b border-gray-800">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={24} color="#17e1c5" />
          </TouchableOpacity>
          <Text
            className="text-white text-lg"
            style={{ fontFamily: "Outfit-SemiBold" }}
          >
            TODAY
          </Text>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={24} color="#17e1c5" />
          </TouchableOpacity>
        </View>
        <View className="h-0.5 bg-accent mt-2" />
      </View>

      {/* Main Content - Empty State */}
      <View className="flex-1 justify-center items-center px-8">
        <Text
          className="text-gray-400 text-lg mb-12"
          style={{ fontFamily: "Outfit-Regular" }}
        >
          Workout Log Empty
        </Text>

        {/* Start New Workout */}
        <TouchableOpacity
          onPress={() => {
            // TODO: Navigate to workout creation
            console.log("Start New Workout");
          }}
          className="items-center mb-8"
        >
          <View className="w-16 h-16 bg-accent rounded-full items-center justify-center mb-3">
            <Ionicons name="add" size={32} color="#000000" />
          </View>
          <Text
            className="text-gray-400 text-base"
            style={{ fontFamily: "Outfit-Medium" }}
          >
            Start New Workout
          </Text>
        </TouchableOpacity>

        {/* Copy Previous Workout */}
        <TouchableOpacity
          onPress={() => {
            // TODO: Navigate to previous workouts
            console.log("Copy Previous Workout");
          }}
          className="items-center"
        >
          <View className="w-16 h-16 bg-gray-800 border border-gray-700 rounded-full items-center justify-center mb-3">
            <Ionicons name="copy" size={24} color="#17e1c5" />
          </View>
          <Text
            className="text-gray-400 text-base"
            style={{ fontFamily: "Outfit-Medium" }}
          >
            Copy Previous Workout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddWorkout;
