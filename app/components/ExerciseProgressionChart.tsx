import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { Ionicons } from "@expo/vector-icons";

interface ExerciseSet {
  weight: number;
  reps: number;
  setNumber: number;
  date: string;
}

interface ExerciseProgressionChartProps {
  exerciseName: string;
  savedSets: ExerciseSet[];
}

const ExerciseProgressionChart: React.FC<ExerciseProgressionChartProps> = ({
  exerciseName,
  savedSets,
}) => {
  const [timeFilter, setTimeFilter] = useState("1m");

  const timeFilterOptions = [
    { key: "1m", label: "1m" },
    { key: "3m", label: "3m" },
    { key: "6m", label: "6m" },
    { key: "1y", label: "1y" },
    { key: "all", label: "all" },
  ];

  // Calculate estimated 1RM using Epley formula: weight * (1 + reps/30)
  const chartData = useMemo(() => {
    if (savedSets.length === 0) return [];

    // Calculate 1RM for each set
    const oneRMData = savedSets.map((set) => ({
      value: Math.round(set.weight * (1 + set.reps / 30) * 10) / 10,
      label: new Date(set.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      date: set.date,
    }));

    // Sort by date
    oneRMData.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return oneRMData;
  }, [savedSets]);

  const getCurrentValue = () => {
    if (chartData.length === 0) return 0;
    return chartData[chartData.length - 1].value;
  };

  const getChange = () => {
    if (chartData.length < 2) return 0;
    const first = chartData[0].value;
    const last = chartData[chartData.length - 1].value;
    return last - first;
  };

  return (
    <View className="flex-1">
      <ScrollView className="px-4 py-3">
        {savedSets.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="trending-up-outline" size={48} color="#6b7280" />
            <Text
              className="text-gray-400 text-lg mt-4 text-center"
              style={{ fontFamily: "Outfit-Regular" }}
            >
              No data to display
            </Text>
            <Text
              className="text-gray-500 text-sm mt-2 text-center"
              style={{ fontFamily: "Outfit-Regular" }}
            >
              Complete some workouts to see your progression chart
            </Text>
          </View>
        ) : (
          <View>
            {/* Chart Title */}
            <Text
              className="text-white text-lg mb-2"
              style={{ fontFamily: "Outfit-SemiBold" }}
            >
              GRAPH: Estimated 1RM
            </Text>

            {/* Time Filter Buttons */}
            <View className="flex-row gap-2 mb-6">
              {timeFilterOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  className={`px-4 py-2 rounded-lg ${
                    timeFilter === option.key ? "bg-accent" : "bg-gray-800"
                  }`}
                  onPress={() => setTimeFilter(option.key)}
                >
                  <Text
                    className={`text-sm ${
                      timeFilter === option.key ? "text-black" : "text-gray-300"
                    }`}
                    style={{ fontFamily: "Outfit-Medium" }}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Chart Container */}
            <View className="bg-gray-800 rounded-lg p-4">
              {/* Stats */}
              <View className="mb-4">
                <Text
                  className="text-2xl text-white"
                  style={{ fontFamily: "Outfit-Bold" }}
                >
                  {getCurrentValue()} kg
                </Text>
                <Text
                  className={`text-sm ${
                    getChange() >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                  style={{ fontFamily: "Outfit-Medium" }}
                >
                  {getChange() >= 0 ? "+" : ""}
                  {getChange().toFixed(1)} kg from start
                </Text>
              </View>

              {/* Chart */}
              <View style={{ height: 200, marginBottom: 20 }}>
                {chartData.length > 0 && (
                  <LineChart
                    data={chartData}
                    width={300}
                    height={180}
                    color="#17e1c5"
                    thickness={3}
                    startFillColor="#17e1c5"
                    endFillColor="#17e1c5"
                    startOpacity={0.8}
                    endOpacity={0.1}
                    initialSpacing={20}
                    endSpacing={20}
                    spacing={40}
                    backgroundColor="transparent"
                    hideRules={false}
                    yAxisColor="#374151"
                    xAxisColor="#374151"
                    yAxisTextStyle={{
                      color: "#9CA3AF",
                      fontSize: 10,
                      fontFamily: "Outfit-Regular",
                    }}
                    xAxisLabelTextStyle={{
                      color: "#9CA3AF",
                      fontSize: 8,
                      fontFamily: "Outfit-Regular",
                    }}
                    curved
                    showVerticalLines
                    verticalLinesColor="#374151"
                    dataPointsColor="#17e1c5"
                    dataPointsRadius={4}
                    dataPointLabelComponent={() => null}
                    areaChart
                  />
                )}
              </View>

              {/* Instruction Text */}
              <Text
                className="text-gray-400 text-sm text-center"
                style={{ fontFamily: "Outfit-Regular" }}
              >
                Tap a point on the graph to view more details
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ExerciseProgressionChart;
