import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-gifted-charts";

interface ProgressionData {
  [key: string]: {
    volume: number;
    sets: number;
    reps: number;
    date: string;
  }[];
}

interface ProgressionChartProps {
  progressionData: ProgressionData;
}

const ProgressionChart: React.FC<ProgressionChartProps> = ({
  progressionData,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string>("volume");
  const [timeFilter, setTimeFilter] = useState<string>("This Week");
  const [showTimeDropdown, setShowTimeDropdown] = useState<boolean>(false);
  const [showMetricDropdown, setShowMetricDropdown] = useState<boolean>(false);

  const timeFilterOptions = [
    "This Week",
    "This Month",
    "3 Months",
    "6 Months",
    "9 Months",
    "This Year",
    "Lifetime",
  ];

  const metricOptions = [
    { key: "volume", label: "Volume (kg)" },
    { key: "sets", label: "Sets" },
    { key: "reps", label: "Reps" },
  ];

  // Generate sample progression data based on time filter
  const chartData = useMemo(() => {
    const getDataPoints = () => {
      const timeMultipliers: { [key: string]: number } = {
        "This Week": 7,
        "This Month": 30,
        "3 Months": 90,
        "6 Months": 180,
        "9 Months": 270,
        "This Year": 365,
        Lifetime: 1000,
      };

      const days = timeMultipliers[timeFilter] || 7;
      const dataPoints = [];

      for (let i = 0; i < days; i += Math.max(1, Math.floor(days / 10))) {
        const baseValue =
          selectedMetric === "volume"
            ? 1500
            : selectedMetric === "sets"
              ? 20
              : 200;
        const progression = Math.sin(i * 0.1) * 0.3 + 1; // Simulate progression with some variation
        const value = Math.floor(baseValue * progression + Math.random() * 100);

        dataPoints.push({
          value: value,
          label: `${i + 1}`,
          dataPointText: value.toString(),
        });
      }

      return dataPoints;
    };

    return getDataPoints();
  }, [timeFilter, selectedMetric]);

  const getMetricLabel = () => {
    return (
      metricOptions.find((option) => option.key === selectedMetric)?.label ||
      "Volume (kg)"
    );
  };

  return (
    <>
      {/* Progression Chart Title */}
      <View className="px-4 mb-2">
        <View className="flex-row items-center justify-between">
          <Text
            className="text-white text-lg"
            style={{ fontFamily: "Outfit-SemiBold" }}
          >
            Progression
          </Text>
          <View className="flex-row items-center space-x-2">
            {/* Metric Dropdown */}
            <View className="relative">
              <TouchableOpacity
                className="flex-row items-center bg-gray-800 rounded-lg px-3 py-2"
                onPress={() => setShowMetricDropdown(!showMetricDropdown)}
              >
                <Text
                  className="text-gray-300 text-sm mr-1"
                  style={{ fontFamily: "Outfit-Regular" }}
                >
                  {getMetricLabel()}
                </Text>
                <Ionicons
                  name={showMetricDropdown ? "chevron-up" : "chevron-down"}
                  size={14}
                  color="#9CA3AF"
                />
              </TouchableOpacity>

              {showMetricDropdown && (
                <View className="absolute top-10 right-0 bg-gray-800 rounded-lg p-2 min-w-32 z-10">
                  {metricOptions.map((option) => (
                    <TouchableOpacity
                      key={option.key}
                      className={`py-2 px-3 rounded ${
                        selectedMetric === option.key
                          ? "bg-accent"
                          : "bg-transparent"
                      }`}
                      onPress={() => {
                        setSelectedMetric(option.key);
                        setShowMetricDropdown(false);
                      }}
                    >
                      <Text
                        className={`text-sm ${
                          selectedMetric === option.key
                            ? "text-black"
                            : "text-gray-300"
                        }`}
                        style={{ fontFamily: "Outfit-Regular" }}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Time Filter Dropdown */}
            <View className="relative">
              <TouchableOpacity
                className="flex-row items-center bg-gray-800 rounded-lg px-3 py-2"
                onPress={() => setShowTimeDropdown(!showTimeDropdown)}
              >
                <Text
                  className="text-gray-300 text-sm mr-1"
                  style={{ fontFamily: "Outfit-Regular" }}
                >
                  {timeFilter}
                </Text>
                <Ionicons
                  name={showTimeDropdown ? "chevron-up" : "chevron-down"}
                  size={14}
                  color="#9CA3AF"
                />
              </TouchableOpacity>

              {showTimeDropdown && (
                <View className="absolute top-10 right-0 bg-gray-800 rounded-lg p-2 min-w-32 z-10">
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
      </View>

      {/* Progression Chart Card */}
      <View className="px-4 mb-6">
        <View className="bg-gray-800 rounded-2xl p-6">
          {chartData.length > 0 ? (
            <LineChart
              data={chartData}
              width={300}
              height={200}
              color="#17e1c5"
              thickness={3}
              startFillColor="#17e1c5"
              endFillColor="#17e1c5"
              startOpacity={0.3}
              endOpacity={0.1}
              initialSpacing={20}
              endSpacing={20}
              spacing={30}
              backgroundColor="transparent"
              hideRules
              yAxisColor="transparent"
              xAxisColor="transparent"
              yAxisTextStyle={{ color: "#9CA3AF", fontSize: 10 }}
              xAxisLabelTextStyle={{ color: "#9CA3AF", fontSize: 10 }}
              curved
              showVerticalLines
              verticalLinesColor="#374151"
              verticalLinesStyle={{ strokeDasharray: [5, 5] }}
              dataPointsColor="#17e1c5"
              dataPointsRadius={4}
              showDataPointOnPress
              dataPointLabelComponent={() => null}
            />
          ) : (
            <View className="items-center justify-center h-48">
              <Text
                className="text-gray-400 text-base text-center"
                style={{ fontFamily: "Outfit-Regular" }}
              >
                No progression data available
              </Text>
            </View>
          )}
        </View>
      </View>
    </>
  );
};

export default ProgressionChart;
