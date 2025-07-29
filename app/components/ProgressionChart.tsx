import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
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
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["weight"]);
  const [timeFilter, setTimeFilter] = useState<string>("This Week");
  const [showTimeDropdown, setShowTimeDropdown] = useState<boolean>(false);
  const [showMetricDropdown, setShowMetricDropdown] = useState<boolean>(false);
  const [selectedDataPoint, setSelectedDataPoint] = useState<any>(null);

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
    { key: "weight", label: "Body Weight" },
    { key: "volume", label: "Total Volume" },
    { key: "bodyfat", label: "Body Fat" },
    { key: "arms", label: "Arms" },
    { key: "chest", label: "Chest" },
    { key: "shoulders", label: "Shoulders" },
    { key: "neck", label: "Neck" },
    { key: "quads", label: "Quads" },
  ];

  // Get color for each metric line
  const getMetricColor = (index: number) => {
    const colors = [
      "#17e1c5",
      "#EF4444",
      "#3B82F6",
      "#F97316",
      "#10B981",
      "#8B5CF6",
      "#EC4899",
      "#F59E0B",
    ];
    return colors[index % colors.length];
  };

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
      const step =
        timeFilter === "This Week" ? 1 : Math.max(1, Math.floor(days / 10));

      // Generate date labels first
      const dateLabels: string[] = [];
      for (let i = 0; i < days; i += step) {
        const date = new Date();
        date.setDate(date.getDate() - (days - i));
        const dateLabel = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        dateLabels.push(dateLabel);
      }

      // Generate data for each selected metric
      const multiLineData = selectedMetrics.map((metric, metricIndex) => {
        const dataPoints = [];

        for (let i = 0; i < days; i += step) {
          let baseValue, value;

          if (metric === "weight") {
            baseValue = 83; // Starting weight
            const progression =
              Math.sin(i * 0.15 + metricIndex * 0.5) * 0.8 + 1;
            value =
              Math.round((baseValue * progression + Math.random() * 2) * 10) /
              10;
          } else if (metric === "volume") {
            baseValue = 1500;
            const progression =
              Math.sin(i * 0.12 + metricIndex * 0.3) * 0.6 + 1;
            value = Math.floor(baseValue * progression + Math.random() * 300);
          } else if (metric === "bodyfat") {
            baseValue = 15; // Starting body fat percentage
            const progression =
              Math.sin(i * 0.18 + metricIndex * 0.4) * 0.4 + 1;
            value =
              Math.round((baseValue * progression + Math.random() * 1.5) * 10) /
              10;
          } else if (metric === "arms") {
            baseValue = 35; // Starting arm circumference in cm
            const progression =
              Math.sin(i * 0.14 + metricIndex * 0.6) * 0.5 + 1;
            value =
              Math.round((baseValue * progression + Math.random() * 1.2) * 10) /
              10;
          } else if (metric === "chest") {
            baseValue = 100; // Starting chest circumference in cm
            const progression =
              Math.sin(i * 0.16 + metricIndex * 0.7) * 0.7 + 1;
            value =
              Math.round((baseValue * progression + Math.random() * 3) * 10) /
              10;
          } else if (metric === "shoulders") {
            baseValue = 120; // Starting shoulder circumference in cm
            const progression =
              Math.sin(i * 0.13 + metricIndex * 0.8) * 0.6 + 1;
            value =
              Math.round((baseValue * progression + Math.random() * 2.5) * 10) /
              10;
          } else if (metric === "neck") {
            baseValue = 40; // Starting neck circumference in cm
            const progression =
              Math.sin(i * 0.17 + metricIndex * 0.9) * 0.3 + 1;
            value =
              Math.round((baseValue * progression + Math.random() * 0.8) * 10) /
              10;
          } else if (metric === "quads") {
            baseValue = 60; // Starting quad circumference in cm
            const progression =
              Math.sin(i * 0.11 + metricIndex * 1.0) * 0.8 + 1;
            value =
              Math.round((baseValue * progression + Math.random() * 2) * 10) /
              10;
          } else {
            baseValue = 200;
            const progression = Math.sin(i * 0.1 + metricIndex * 0.5) * 0.5 + 1;
            value = Math.floor(baseValue * progression + Math.random() * 100);
          }

          dataPoints.push({
            value: value,
            label: dateLabels[Math.floor(i / step)],
            dataPointText:
              metric === "weight" ||
              metric === "bodyfat" ||
              metric === "arms" ||
              metric === "chest" ||
              metric === "shoulders" ||
              metric === "neck" ||
              metric === "quads"
                ? value.toFixed(1)
                : value.toString(),
          });
        }

        return {
          data: dataPoints,
          color: getMetricColor(metricIndex),
          title:
            metricOptions.find((opt) => opt.key === metric)?.label || metric,
        };
      });

      return multiLineData;
    };

    return getDataPoints();
  }, [timeFilter, selectedMetrics]);

  // Calculate current value and 30-day change for the first selected metric
  const currentValue = useMemo(() => {
    if (chartData.length === 0 || selectedMetrics.length === 0)
      return { value: 0, change: 0 };
    const firstMetricData = chartData[0];
    if (!firstMetricData || firstMetricData.data.length === 0)
      return { value: 0, change: 0 };

    const latest = firstMetricData.data[firstMetricData.data.length - 1];
    const previous =
      firstMetricData.data.length > 1
        ? firstMetricData.data[firstMetricData.data.length - 2]
        : latest;
    const change = latest.value - previous.value;
    return { value: latest.value, change: change };
  }, [chartData, selectedMetrics]);

  const getMetricLabel = () => {
    if (selectedMetrics.length === 0) return "Select Metric";
    if (selectedMetrics.length === 1) {
      return (
        metricOptions.find((option) => option.key === selectedMetrics[0])
          ?.label || "Metric"
      );
    }
    return `${selectedMetrics.length} Metrics Selected`;
  };

  const handleDataPointPress = (dataPoint: any, metric: string) => {
    const metricLabel =
      metricOptions.find((m) => m.key === metric)?.label || metric;
    const unit = getUnit(metric);
    const value = dataPoint.value;
    const date = dataPoint.label;

    Alert.alert(
      `${metricLabel} Data`,
      `Date: ${date}\nValue: ${value} ${unit}`,
      [{ text: "OK", style: "default" }]
    );
  };

  const getUnit = (metric: string) => {
    switch (metric) {
      case "weight":
        return "kg";
      case "volume":
        return "kg";
      case "bodyfat":
        return "%";
      case "arms":
      case "chest":
      case "shoulders":
      case "neck":
      case "quads":
        return "cm";
      default:
        return "units";
    }
  };

  const removeMetric = (metricToRemove: string) => {
    setSelectedMetrics(
      selectedMetrics.filter((metric) => metric !== metricToRemove)
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
            My Progression History
          </Text>

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
                {selectedMetrics.length > 0
                  ? getMetricLabel()
                  : "Select Metric"}
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
                      selectedMetrics.includes(option.key)
                        ? "bg-accent"
                        : "bg-transparent"
                    }`}
                    onPress={() => {
                      if (selectedMetrics.includes(option.key)) {
                        setSelectedMetrics(
                          selectedMetrics.filter((m) => m !== option.key)
                        );
                      } else {
                        setSelectedMetrics([...selectedMetrics, option.key]);
                      }
                      setShowMetricDropdown(false);
                    }}
                  >
                    <Text
                      className={`text-sm ${
                        selectedMetrics.includes(option.key)
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
        </View>
      </View>

      {/* Progression Chart Card */}
      <View className="px-4 mb-6">
        <View className="bg-gray-800 rounded-2xl p-6">
          {/* Header with dropdowns and log button */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-1">
              <Text
                className="text-gray-400 text-sm"
                style={{ fontFamily: "Outfit-Regular" }}
              >
                Progression (
                {selectedMetrics[0] === "weight"
                  ? "kg"
                  : selectedMetrics[0] === "volume"
                    ? "kg"
                    : selectedMetrics[0] === "bodyfat"
                      ? "%"
                      : selectedMetrics[0] === "arms" ||
                          selectedMetrics[0] === "chest" ||
                          selectedMetrics[0] === "shoulders" ||
                          selectedMetrics[0] === "neck" ||
                          selectedMetrics[0] === "quads"
                        ? "cm"
                        : "units"}
                )
              </Text>
              <Text
                className="text-accent text-2xl"
                style={{ fontFamily: "Outfit-Bold" }}
              >
                {selectedMetrics[0] === "weight"
                  ? currentValue.value.toFixed(1)
                  : currentValue.value.toLocaleString()}
              </Text>
              <View className="flex-row items-center mt-1">
                <Text
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: "Outfit-Regular" }}
                >
                  Last 30 days
                </Text>
                <Ionicons
                  name={
                    currentValue.change >= 0 ? "chevron-up" : "chevron-down"
                  }
                  size={12}
                  color={currentValue.change >= 0 ? "#10B981" : "#EF4444"}
                  style={{ marginLeft: 4 }}
                />
                <Text
                  className={`text-sm ml-1 ${
                    currentValue.change >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                  style={{ fontFamily: "Outfit-Regular" }}
                >
                  {Math.abs(currentValue.change).toFixed(1)}
                </Text>
              </View>
            </View>

            {/* Log Button */}
            <TouchableOpacity className="bg-accent rounded-lg px-4 py-2 ml-4">
              <Text
                className="text-black text-sm font-semibold"
                style={{ fontFamily: "Outfit-SemiBold" }}
              >
                LOG
              </Text>
            </TouchableOpacity>
          </View>

          {/* Selected Metrics Filter Tags */}
          {selectedMetrics.length > 0 && (
            <View className="mb-3">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row space-x-2">
                  {selectedMetrics.map((metric, index) => {
                    const metricLabel =
                      metricOptions.find((m) => m.key === metric)?.label ||
                      metric;
                    const metricColor = getMetricColor(index);
                    return (
                      <TouchableOpacity
                        key={metric}
                        className="flex-row items-center rounded-full px-3 py-1 border"
                        style={{
                          backgroundColor: "transparent",
                          borderColor: metricColor,
                        }}
                        onPress={() => removeMetric(metric)}
                      >
                        <Text
                          className="text-sm mr-1"
                          style={{
                            fontFamily: "Outfit-Regular",
                            color: metricColor,
                          }}
                        >
                          {metricLabel}
                        </Text>
                        <Ionicons name="close" size={14} color={metricColor} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Time Filter Dropdown */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="relative">
              <TouchableOpacity
                className="flex-row items-center bg-gray-700 rounded-lg px-3 py-2"
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
                <View className="absolute top-10 left-0 bg-gray-700 rounded-lg p-2 min-w-32 z-10">
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

          {/* Chart */}
          {chartData.length > 0 ? (
            <View>
              {/* Primary chart with first metric */}
              <LineChart
                data={chartData[0]?.data || []}
                width={300}
                height={200}
                color={chartData[0]?.color || "#17e1c5"}
                thickness={3}
                startFillColor={chartData[0]?.color || "#17e1c5"}
                endFillColor={chartData[0]?.color || "#17e1c5"}
                startOpacity={0.8}
                endOpacity={0.1}
                initialSpacing={20}
                endSpacing={20}
                spacing={timeFilter === "This Week" ? 50 : 30}
                backgroundColor="transparent"
                hideRules={true}
                yAxisColor="transparent"
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
                dataPointsColor={chartData[0]?.color || "#17e1c5"}
                dataPointsRadius={4}
                dataPointLabelComponent={() => null}
                areaChart
                onPress={(dataPoint: any) =>
                  handleDataPointPress(dataPoint, selectedMetrics[0])
                }
              />

              {/* Overlay additional lines */}
              {chartData.slice(1).map((lineData, index) => (
                <View
                  key={lineData.title}
                  style={{ position: "absolute", top: 0, left: 0 }}
                >
                  <LineChart
                    data={lineData.data}
                    width={300}
                    height={200}
                    color={lineData.color}
                    thickness={4}
                    startFillColor={lineData.color}
                    endFillColor={lineData.color}
                    startOpacity={0.4}
                    endOpacity={0.05}
                    initialSpacing={20}
                    endSpacing={20}
                    spacing={timeFilter === "This Week" ? 50 : 30}
                    backgroundColor="transparent"
                    hideRules={true}
                    yAxisColor="transparent"
                    xAxisColor="transparent"
                    yAxisTextStyle={{
                      color: "transparent",
                      fontSize: 10,
                      fontFamily: "Outfit-Regular",
                    }}
                    xAxisLabelTextStyle={{
                      color: "transparent",
                      fontSize: 8,
                      fontFamily: "Outfit-Regular",
                    }}
                    curved
                    showVerticalLines={false}
                    verticalLinesColor="transparent"
                    dataPointsColor={lineData.color}
                    dataPointsRadius={5}
                    dataPointLabelComponent={() => null}
                    areaChart
                    onPress={(dataPoint: any) =>
                      handleDataPointPress(dataPoint, lineData.title)
                    }
                  />
                </View>
              ))}

              {/* Top layer with just the lines and data points */}
              {chartData.slice(1).map((lineData, index) => (
                <View
                  key={`line-${lineData.title}`}
                  style={{ position: "absolute", top: 0, left: 0 }}
                >
                  <LineChart
                    data={lineData.data}
                    width={300}
                    height={200}
                    color={lineData.color}
                    thickness={3}
                    startFillColor="transparent"
                    endFillColor="transparent"
                    startOpacity={0}
                    endOpacity={0}
                    initialSpacing={20}
                    endSpacing={20}
                    spacing={timeFilter === "This Week" ? 50 : 30}
                    backgroundColor="transparent"
                    hideRules={true}
                    yAxisColor="transparent"
                    xAxisColor="transparent"
                    yAxisTextStyle={{
                      color: "transparent",
                      fontSize: 10,
                      fontFamily: "Outfit-Regular",
                    }}
                    xAxisLabelTextStyle={{
                      color: "transparent",
                      fontSize: 8,
                      fontFamily: "Outfit-Regular",
                    }}
                    curved
                    showVerticalLines={false}
                    verticalLinesColor="transparent"
                    dataPointsColor={lineData.color}
                    dataPointsRadius={5}
                    dataPointLabelComponent={() => null}
                    areaChart={false}
                    onPress={(dataPoint: any) =>
                      handleDataPointPress(dataPoint, lineData.title)
                    }
                  />
                </View>
              ))}
            </View>
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
