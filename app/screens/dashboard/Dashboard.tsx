import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ButtonNavBar from "../../components/ButtonNavBar";
import TrainingBreakdownCard from "../../components/TrainingBreakdownCard";

const { width } = Dimensions.get("window");

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    // TODO: Add navigation logic here when other screens are implemented
    console.log(`Navigating to ${tabId}`);
  };

  // Dummy data for workout frequency
  const workoutData = [
    { week: "10 MAY", count: 0, avgTime: 0, totalVolume: 0 },
    { week: "17 MAY", count: 0, avgTime: 0, totalVolume: 0 },
    { week: "24 MAY", count: 0, avgTime: 0, totalVolume: 0 },
    { week: "31 MAY", count: 0, avgTime: 0, totalVolume: 0 },
    { week: "7 JUN", count: 2, avgTime: 45, totalVolume: 1785 },
    { week: "14 JUN", count: 3, avgTime: 52, totalVolume: 2450 },
    { week: "21 JUN", count: 1, avgTime: 38, totalVolume: 1200 },
    { week: "28 JUN", count: 4, avgTime: 48, totalVolume: 3200 },
  ];

  const maxWorkouts = Math.max(...workoutData.map((w) => w.count));

  // Dummy data for training breakdown
  const muscleGroupData = {
    "This Week": {
      SHOULDERS: {
        sets: 12,
        volume: 2400,
        percentage: 23.53,
        color: "#8B5CF6",
      },
      CHEST: { sets: 15, volume: 2800, percentage: 29.41, color: "#EF4444" },
      BACK: { sets: 8, volume: 1600, percentage: 15.69, color: "#3B82F6" },
      ARMS: { sets: 10, volume: 1800, percentage: 19.61, color: "#F97316" },
      LEGS: { sets: 6, volume: 1500, percentage: 11.76, color: "#10B981" },
    },
    "This Month": {
      SHOULDERS: { sets: 45, volume: 9000, percentage: 25.0, color: "#8B5CF6" },
      CHEST: { sets: 52, volume: 10400, percentage: 28.89, color: "#EF4444" },
      BACK: { sets: 38, volume: 7600, percentage: 21.11, color: "#3B82F6" },
      ARMS: { sets: 42, volume: 8400, percentage: 23.33, color: "#F97316" },
      LEGS: { sets: 23, volume: 4600, percentage: 12.78, color: "#10B981" },
    },
    "This Year": {
      SHOULDERS: {
        sets: 180,
        volume: 36000,
        percentage: 22.5,
        color: "#8B5CF6",
      },
      CHEST: { sets: 210, volume: 42000, percentage: 26.25, color: "#EF4444" },
      BACK: { sets: 165, volume: 33000, percentage: 20.63, color: "#3B82F6" },
      ARMS: { sets: 195, volume: 39000, percentage: 24.38, color: "#F97316" },
      LEGS: { sets: 90, volume: 18000, percentage: 11.25, color: "#10B981" },
    },
    Lifetime: {
      SHOULDERS: {
        sets: 720,
        volume: 144000,
        percentage: 24.0,
        color: "#8B5CF6",
      },
      CHEST: { sets: 780, volume: 156000, percentage: 26.0, color: "#EF4444" },
      BACK: { sets: 600, volume: 120000, percentage: 20.0, color: "#3B82F6" },
      ARMS: { sets: 690, volume: 138000, percentage: 23.0, color: "#F97316" },
      LEGS: { sets: 360, volume: 72000, percentage: 12.0, color: "#10B981" },
    },
  };

  const handleBarPress = (index: number) => {
    setSelectedWeek(selectedWeek === index ? null : index);
  };

  const selectedWeekData =
    selectedWeek !== null ? workoutData[selectedWeek] : null;

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="px-4 pt-2 pb-6 mt-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="relative">
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
                  }}
                  className="w-12 h-12 rounded-full"
                />
                <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-gray-900" />
              </View>
              <View className="ml-3 flex-1">
                <Text
                  className="text-accent text-lg"
                  style={{ fontFamily: "Outfit-Bold" }}
                >
                  Hello Parmis!
                </Text>
                <Text
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: "Outfit-Regular" }}
                >
                  Let's start your day
                </Text>
              </View>
            </View>
            <TouchableOpacity className="p-2">
              <Ionicons name="trophy" size={24} color="#17e1c5" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Workout Frequency Title */}
        <View className="px-4 mb-2">
          <Text
            className="text-white text-lg"
            style={{ fontFamily: "Outfit-SemiBold" }}
          >
            Workout Frequency
          </Text>
        </View>

        {/* Workout Frequency Card */}
        <View className="px-4 mb-6">
          <View className="bg-gray-800 rounded-2xl p-4">
            {/* Summary Statistics */}
            <View className="flex-row items-center justify-between mb-9">
              <View className="flex-1">
                <Text
                  className="text-gray-400 text-sm mb-1"
                  style={{ fontFamily: "Outfit-Regular" }}
                >
                  Workouts
                </Text>
                <Text
                  className="text-accent text-2xl"
                  style={{ fontFamily: "Outfit-Bold" }}
                >
                  {selectedWeek !== null
                    ? selectedWeekData?.count || 0
                    : workoutData.reduce((sum, week) => sum + week.count, 0)}
                </Text>
              </View>
              <View className="flex-1">
                <Text
                  className="text-gray-400 text-sm mb-1"
                  style={{ fontFamily: "Outfit-Regular" }}
                >
                  Time(min)
                </Text>
                <Text
                  className="text-accent text-2xl"
                  style={{ fontFamily: "Outfit-Bold" }}
                >
                  {selectedWeek !== null
                    ? (selectedWeekData?.count || 0) *
                      (selectedWeekData?.avgTime || 0)
                    : workoutData.reduce(
                        (sum, week) => sum + week.count * week.avgTime,
                        0
                      )}
                </Text>
              </View>
              <View className="flex-1">
                <Text
                  className="text-gray-400 text-sm mb-1"
                  style={{ fontFamily: "Outfit-Regular" }}
                >
                  Volume(kg)
                </Text>
                <Text
                  className="text-accent text-2xl"
                  style={{ fontFamily: "Outfit-Bold" }}
                >
                  {selectedWeek !== null
                    ? selectedWeekData?.totalVolume || 0
                    : workoutData.reduce(
                        (sum, week) => sum + week.totalVolume,
                        0
                      )}
                </Text>
              </View>
            </View>

            {/* Chart Card */}
            <View className="bg-gray-900 rounded-xl p-6">
              <Text
                className="text-white text-base mb-6 text-center"
                style={{ fontFamily: "Outfit-Medium" }}
              >
                Workout times per week
              </Text>

              <View className="flex-row items-end justify-between h-36 relative">
                {/* Y-axis grid lines */}
                <View className="absolute left-0 right-0 h-36">
                  {/* Line at 1 workout (21 JUN) */}
                  <View
                    className="flex-row items-center absolute"
                    style={{
                      bottom: (0 / 4) * 90 + 40, // 40px for bottom spacing
                      left: 0,
                      right: 0,
                    }}
                  >
                    <Text
                      className="text-gray-400 text-xs mr-2"
                      style={{ fontFamily: "Outfit-Regular" }}
                    >
                      1
                    </Text>
                    <View
                      className="flex-1 h-px bg-gray-600 opacity-30"
                      style={{ borderStyle: "dashed" }}
                    />
                  </View>

                  {/* Line at 2 workouts (7 JUN) */}
                  <View
                    className="flex-row items-center absolute"
                    style={{
                      bottom: (1 / 4) * 90 + 40,
                      left: 0,
                      right: 0,
                    }}
                  >
                    <Text
                      className="text-gray-400 text-xs mr-2"
                      style={{ fontFamily: "Outfit-Regular" }}
                    >
                      2
                    </Text>
                    <View
                      className="flex-1 h-px bg-gray-600 opacity-30"
                      style={{ borderStyle: "dashed" }}
                    />
                  </View>

                  {/* Line at 3 workouts (14 JUN) */}
                  <View
                    className="flex-row items-center absolute"
                    style={{
                      bottom: (2 / 4) * 90 + 40,
                      left: 0,
                      right: 0,
                    }}
                  >
                    <Text
                      className="text-gray-400 text-xs mr-2"
                      style={{ fontFamily: "Outfit-Regular" }}
                    >
                      3
                    </Text>
                    <View
                      className="flex-1 h-px bg-gray-600 opacity-30"
                      style={{ borderStyle: "dashed" }}
                    />
                  </View>

                  {/* Line at 4 workouts (28 JUN) */}
                  <View
                    className="flex-row items-center absolute"
                    style={{
                      bottom: (3 / 4) * 90 + 40,
                      left: 0,
                      right: 0,
                    }}
                  >
                    <Text
                      className="text-gray-400 text-xs mr-2"
                      style={{ fontFamily: "Outfit-Regular" }}
                    >
                      4
                    </Text>
                    <View
                      className="flex-1 h-px bg-gray-600 opacity-30"
                      style={{ borderStyle: "dashed" }}
                    />
                  </View>
                </View>

                {/* Chart bars */}
                <View className="flex-row items-end justify-between w-full h-36">
                  {workoutData.map((week, index) => (
                    <TouchableOpacity
                      key={week.week}
                      className="flex-1 items-center"
                      onPress={() => handleBarPress(index)}
                      activeOpacity={0.7}
                    >
                      <View className="items-center mb-1">
                        {week.count > 0 && (
                          <Text
                            className="text-accent text-sm mb-1"
                            style={{ fontFamily: "Outfit-Bold" }}
                          >
                            {week.count}
                          </Text>
                        )}
                        <View
                          className={`w-6 rounded-t-lg ${
                            week.count > 0 ? "bg-accent" : "bg-gray-600"
                          } ${selectedWeek === index ? "opacity-100" : "opacity-80"}`}
                          style={{
                            height: week.count > 0 ? (week.count / 4) * 90 : 8,
                          }}
                        />
                      </View>
                      <Text
                        className="text-gray-400 text-xs mt-2 text-center"
                        style={{ fontFamily: "Outfit-Regular" }}
                      >
                        {week.week}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>

        <TrainingBreakdownCard muscleGroupData={muscleGroupData} />
      </ScrollView>
      <ButtonNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

export default Dashboard;
