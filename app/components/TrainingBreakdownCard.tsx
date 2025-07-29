import React, { useState, useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PieChart } from "react-native-gifted-charts";

interface MuscleGroupData {
  [key: string]: {
    sets: number;
    volume: number;
    percentage: number;
    color: string;
  };
}

interface TrainingBreakdownCardProps {
  muscleGroupData: {
    [key: string]: MuscleGroupData;
  };
}

const TrainingBreakdownCard: React.FC<TrainingBreakdownCardProps> = ({
  muscleGroupData,
}) => {
  const [selectedMuscleGroup, setSelectedMuscleGroup] =
    useState<string>("SHOULDERS");
  const [timeFilter, setTimeFilter] = useState<string>("This Week");
  const [showTimeDropdown, setShowTimeDropdown] = useState<boolean>(false);

  const timeFilterOptions = [
    "This Week",
    "This Month",
    "3 Months",
    "6 Months",
    "9 Months",
    "This Year",
    "Lifetime",
  ];

  // Calculate dynamic metrics based on selected time filter
  const dynamicMetrics = useMemo(() => {
    const currentData =
      muscleGroupData[timeFilter as keyof typeof muscleGroupData];
    if (!currentData || Object.keys(currentData).length === 0) {
      return {
        totalWorkouts: 0,
        totalSets: 0,
        totalReps: 0,
        totalVolume: 0,
      };
    }

    // Calculate totals from muscle group data
    const totals = Object.values(currentData).reduce(
      (acc, muscleGroup) => {
        // Estimate reps based on sets (assuming average 8-12 reps per set)
        const estimatedReps = muscleGroup.sets * 10;

        return {
          sets: acc.sets + muscleGroup.sets,
          volume: acc.volume + muscleGroup.volume,
          reps: acc.reps + estimatedReps,
        };
      },
      { sets: 0, volume: 0, reps: 0 }
    );

    // Generate workout count based on time filter and data
    const getWorkoutCount = () => {
      const baseWorkouts = Object.keys(currentData).length;
      const timeMultipliers: { [key: string]: number } = {
        "This Week": 1,
        "This Month": 4,
        "3 Months": 12,
        "6 Months": 24,
        "9 Months": 36,
        "This Year": 52,
        Lifetime: 100,
      };
      return Math.max(
        baseWorkouts,
        Math.floor(baseWorkouts * (timeMultipliers[timeFilter] || 1))
      );
    };

    return {
      totalWorkouts: getWorkoutCount(),
      totalSets: totals.sets,
      totalReps: totals.reps,
      totalVolume: totals.volume,
    };
  }, [muscleGroupData, timeFilter]);

  // Memoize the chart data to prevent unnecessary re-renders
  const chartData = useMemo(() => {
    const currentData =
      muscleGroupData[timeFilter as keyof typeof muscleGroupData];
    if (!currentData || Object.keys(currentData).length === 0) return [];

    // Define accent color shades based on your actual accent color #17e1c5
    const accentShades = [
      "#17e1c5", // Main accent color
      "#14c4a8", // Darker shade
      "#1af8d8", // Lighter shade
      "#11a08c", // Very dark shade
      "#2df8e0", // Very light shade
      "#0d8a75", // Darkest shade
    ];

    return Object.entries(currentData).map(([muscleGroup, data], index) => ({
      value: data.percentage,
      text: "",
      color: accentShades[index % accentShades.length],
      gradientCenterColor: accentShades[index % accentShades.length],
      textColor: "white",
      textSize: 12,
      shiftTextX: 0,
      shiftTextY: 0,
      focused: selectedMuscleGroup === muscleGroup,
    }));
  }, [muscleGroupData, timeFilter, selectedMuscleGroup]);

  // Memoize the onPress handler
  const handlePress = useCallback(
    (item: any, index: number) => {
      const muscleGroups = Object.keys(
        muscleGroupData[timeFilter as keyof typeof muscleGroupData]
      );
      if (muscleGroups[index]) {
        setSelectedMuscleGroup(muscleGroups[index]);
      }
    },
    [muscleGroupData, timeFilter]
  );

  return (
    <>
      {/* Training Breakdown Title */}
      <View className="px-4 mb-2">
        <View className="flex-row items-center justify-between">
          <Text
            className="text-white text-lg"
            style={{ fontFamily: "Outfit-SemiBold" }}
          >
            Training Breakdown
          </Text>
          <View className="relative">
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => setShowTimeDropdown(!showTimeDropdown)}
            >
              <Text
                className="text-gray-400 text-sm mr-1"
                style={{ fontFamily: "Outfit-Regular" }}
              >
                {timeFilter}
              </Text>
              <Ionicons
                name={showTimeDropdown ? "chevron-up" : "chevron-down"}
                size={16}
                color="#9CA3AF"
              />
            </TouchableOpacity>

            {/* Inline Dropdown */}
            {showTimeDropdown && (
              <View className="absolute top-8 right-0 bg-gray-800 rounded-lg p-2 min-w-32 z-10">
                {timeFilterOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    className={`py-2 px-3 rounded ${
                      timeFilter === option ? "bg-accent" : "bg-transparent"
                    }`}
                    onPress={() => {
                      setTimeFilter(option);
                      setShowTimeDropdown(false);
                    }}
                  >
                    <Text
                      className={`text-sm ${
                        timeFilter === option ? "text-black" : "text-gray-300"
                      }`}
                      style={{ fontFamily: "Outfit-Regular" }}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Training Breakdown Card */}
      <View className="px-4 mb-6">
        <View className="bg-gray-800 rounded-2xl p-6">
          {/* Animated Donut Chart */}
          <View className="flex-row items-center justify-center relative">
            {/* Navigation Arrows - Right Side */}
            {chartData.length > 0 && (
              <View className="absolute right-0 top-1/2 transform -translate-y-1/2">
                <TouchableOpacity
                  className="w-8 h-8 bg-gray-800 rounded-full items-center justify-center mb-2"
                  onPress={() => {
                    const muscleGroups = Object.keys(
                      muscleGroupData[
                        timeFilter as keyof typeof muscleGroupData
                      ]
                    );
                    const currentIndex =
                      muscleGroups.indexOf(selectedMuscleGroup);
                    const prevIndex =
                      currentIndex > 0
                        ? currentIndex - 1
                        : muscleGroups.length - 1;
                    setSelectedMuscleGroup(muscleGroups[prevIndex]);
                  }}
                >
                  <Ionicons name="chevron-up" size={16} color="#17e1c5" />
                </TouchableOpacity>

                <TouchableOpacity
                  className="w-8 h-8 bg-gray-800 rounded-full items-center justify-center"
                  onPress={() => {
                    const muscleGroups = Object.keys(
                      muscleGroupData[
                        timeFilter as keyof typeof muscleGroupData
                      ]
                    );
                    const currentIndex =
                      muscleGroups.indexOf(selectedMuscleGroup);
                    const nextIndex =
                      currentIndex < muscleGroups.length - 1
                        ? currentIndex + 1
                        : 0;
                    setSelectedMuscleGroup(muscleGroups[nextIndex]);
                  }}
                >
                  <Ionicons name="chevron-down" size={16} color="#17e1c5" />
                </TouchableOpacity>
              </View>
            )}

            {/* Centered Donut Chart */}
            <View className="w-48 h-48 items-center justify-center">
              {chartData.length > 0 ? (
                <PieChart
                  data={chartData}
                  donut
                  showText={false}
                  textColor="white"
                  radius={80}
                  innerRadius={65}
                  strokeWidth={2}
                  strokeColor="#1F2937"
                  innerCircleBorderWidth={2}
                  innerCircleBorderColor="#1F2937"
                  innerCircleColor="#1F2937"
                  sectionAutoFocus
                  showGradient
                  centerLabelComponent={() => {
                    const currentData =
                      muscleGroupData[
                        timeFilter as keyof typeof muscleGroupData
                      ];
                    const selectedData = currentData?.[selectedMuscleGroup];

                    return (
                      <View className="items-center justify-center">
                        <Text
                          className="text-accent text-xl font-semibold mb-1 mt-4"
                          style={{ fontFamily: "Outfit-SemiBold" }}
                        >
                          {selectedMuscleGroup.charAt(0).toUpperCase() +
                            selectedMuscleGroup.slice(1).toLowerCase()}
                        </Text>
                        <Text
                          className="text-accent/60 text-xs mb-1"
                          style={{ fontFamily: "Outfit-Regular" }}
                        >
                          {selectedData?.sets || 0} sets
                        </Text>
                        <Text
                          className="text-accent/60 text-xs"
                          style={{ fontFamily: "Outfit-Regular" }}
                        >
                          {selectedData?.volume.toLocaleString() || 0} kg
                        </Text>
                      </View>
                    );
                  }}
                  onPress={handlePress}
                />
              ) : (
                <View className="items-center justify-center">
                  <Text
                    className="text-gray-400 text-base text-center"
                    style={{ fontFamily: "Outfit-Regular" }}
                  >
                    No data available for this time period
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Dynamic Data Boxes */}
      <View className="px-4 mb-6">
        <View className="flex-row flex-wrap">
          {/* Total Workouts */}
          <View className="w-1/2 p-2">
            <View className="bg-gray-800 rounded-lg p-4 items-center h-24 justify-center">
              <Text
                className="text-gray-400 text-sm tracking-wide mb-2"
                style={{ fontFamily: "Outfit-Regular" }}
              >
                Total Workouts
              </Text>
              <Text
                className="text-accent text-xl"
                style={{ fontFamily: "Outfit-SemiBold" }}
              >
                {dynamicMetrics.totalWorkouts}
              </Text>
            </View>
          </View>

          {/* Total Sets */}
          <View className="w-1/2 p-2">
            <View className="bg-gray-800 rounded-lg p-4 items-center h-24 justify-center">
              <Text
                className="text-gray-400 text-sm tracking-wide mb-2"
                style={{ fontFamily: "Outfit-Regular" }}
              >
                Total Sets
              </Text>
              <Text
                className="text-accent text-xl"
                style={{ fontFamily: "Outfit-SemiBold" }}
              >
                {dynamicMetrics.totalSets}
              </Text>
            </View>
          </View>

          {/* Total Reps */}
          <View className="w-1/2 p-2">
            <View className="bg-gray-800 rounded-lg p-4 items-center h-24 justify-center">
              <Text
                className="text-gray-400 text-sm tracking-wide mb-2"
                style={{ fontFamily: "Outfit-Regular" }}
              >
                Total Reps
              </Text>
              <Text
                className="text-accent text-xl"
                style={{ fontFamily: "Outfit-SemiBold" }}
              >
                {dynamicMetrics.totalReps.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Total Volume */}
          <View className="w-1/2 p-2">
            <View className="bg-gray-800 rounded-lg p-4 items-center h-24 justify-center">
              <Text
                className="text-gray-400 text-sm tracking-wide mb-2"
                style={{ fontFamily: "Outfit-Regular" }}
              >
                Total Volume
              </Text>
              <Text
                className="text-accent text-xl"
                style={{ fontFamily: "Outfit-SemiBold" }}
              >
                {dynamicMetrics.totalVolume.toLocaleString()} kg
              </Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default TrainingBreakdownCard;
