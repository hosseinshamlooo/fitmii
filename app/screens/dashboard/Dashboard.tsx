import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ButtonNavBar from "../../components/ButtonNavBar";
import TrainingBreakdownCard from "../../components/TrainingBreakdownCard";
import ProgressionChart from "../../components/ProgressionChart";
import AddWorkout from "../workout/AddWorkout";

const { width } = Dimensions.get("window");

interface SavedSet {
  weight: number;
  reps: number;
  setNumber: number;
  date: string;
  comment?: string;
  isPersonalRecord?: boolean;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("dashboard"); // Track current screen
  const [savedWorkouts, setSavedWorkouts] = useState<
    Array<{
      exerciseName: string;
      sets: SavedSet[];
    }>
  >([]);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleTabPress = (tabId: string) => {
    console.log(`Tab pressed: ${tabId}`);

    // Handle home navigation - always go to dashboard
    if (tabId === "home") {
      setActiveTab("home"); // Set active tab immediately for visual feedback
      if (showAddWorkout) {
        // Trigger slide animation back to dashboard
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowAddWorkout(false);
          setCurrentScreen("dashboard");
        });
      }
      return;
    }

    if (tabId === "log") {
      console.log("Opening AddWorkout screen");
      setActiveTab("log"); // Set active tab immediately for visual feedback
      setShowAddWorkout(true);
      setCurrentScreen("addWorkout");
      // Use setTimeout to ensure component is rendered before animation
      setTimeout(() => {
        console.log("Starting slide animation");
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 50);
    } else {
      setActiveTab(tabId);
      setShowAddWorkout(false);
      setCurrentScreen("dashboard");
    }
  };

  const handleBackFromAddWorkout = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowAddWorkout(false);
      setActiveTab("home");
    });
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

  // Dummy progression data
  const progressionData = {
    "This Week": [
      { volume: 1200, sets: 15, reps: 150, date: "Mon" },
      { volume: 1400, sets: 18, reps: 180, date: "Tue" },
      { volume: 1600, sets: 20, reps: 200, date: "Wed" },
      { volume: 1800, sets: 22, reps: 220, date: "Thu" },
      { volume: 2000, sets: 25, reps: 250, date: "Fri" },
      { volume: 2200, sets: 28, reps: 280, date: "Sat" },
      { volume: 2400, sets: 30, reps: 300, date: "Sun" },
    ],
    "This Month": [
      { volume: 8000, sets: 80, reps: 800, date: "Week 1" },
      { volume: 10000, sets: 100, reps: 1000, date: "Week 2" },
      { volume: 12000, sets: 120, reps: 1200, date: "Week 3" },
      { volume: 14000, sets: 140, reps: 1400, date: "Week 4" },
    ],
    "This Year": [
      { volume: 50000, sets: 500, reps: 5000, date: "Jan" },
      { volume: 60000, sets: 600, reps: 6000, date: "Feb" },
      { volume: 70000, sets: 700, reps: 7000, date: "Mar" },
      { volume: 80000, sets: 800, reps: 8000, date: "Apr" },
      { volume: 90000, sets: 900, reps: 9000, date: "May" },
      { volume: 100000, sets: 1000, reps: 10000, date: "Jun" },
    ],
    Lifetime: [
      { volume: 200000, sets: 2000, reps: 20000, date: "2020" },
      { volume: 300000, sets: 3000, reps: 30000, date: "2021" },
      { volume: 400000, sets: 4000, reps: 40000, date: "2022" },
      { volume: 500000, sets: 5000, reps: 50000, date: "2023" },
    ],
  };

  const handleBarPress = (index: number) => {
    setSelectedWeek(selectedWeek === index ? null : index);
  };

  const selectedWeekData =
    selectedWeek !== null ? workoutData[selectedWeek] : null;

  return (
    <View className="flex-1 bg-gray-900">
      {/* Dashboard Content */}
      <Animated.View
        style={{
          flex: 1,
          transform: [
            {
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -width],
              }),
            },
          ],
        }}
      >
        <SafeAreaView className="flex-1">
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
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
                        : workoutData.reduce(
                            (sum, week) => sum + week.count,
                            0
                          )}
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
                                height:
                                  week.count > 0 ? (week.count / 4) * 90 : 8,
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
            <ProgressionChart progressionData={progressionData} />
          </ScrollView>
        </SafeAreaView>
      </Animated.View>

      {/* AddWorkout Content */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 100, // Leave space for the bottom navigation
          transform: [
            {
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [width, 0],
              }),
            },
          ],
        }}
      >
        {showAddWorkout && (
          <AddWorkout
            onBack={handleBackFromAddWorkout}
            onHome={() => setShowAddWorkout(false)}
            currentScreen={currentScreen}
            setCurrentScreen={setCurrentScreen}
            savedWorkouts={savedWorkouts}
            setSavedWorkouts={setSavedWorkouts}
          />
        )}
      </Animated.View>

      {/* Sticky Bottom Navigation */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <ButtonNavBar activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    </View>
  );
};

export default Dashboard;
