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

  // Individual time filters for each chart
  const [bodyWeightTimeFilter, setBodyWeightTimeFilter] =
    useState<string>("This Week");
  const [totalVolumeTimeFilter, setTotalVolumeTimeFilter] =
    useState<string>("This Week");
  const [bodyFatTimeFilter, setBodyFatTimeFilter] =
    useState<string>("This Week");
  const [bodyMeasurementsTimeFilter, setBodyMeasurementsTimeFilter] =
    useState<string>("This Week");

  // Individual dropdown states for each chart
  const [showBodyWeightTimeDropdown, setShowBodyWeightTimeDropdown] =
    useState<boolean>(false);
  const [showTotalVolumeTimeDropdown, setShowTotalVolumeTimeDropdown] =
    useState<boolean>(false);
  const [showBodyFatTimeDropdown, setShowBodyFatTimeDropdown] =
    useState<boolean>(false);
  const [
    showBodyMeasurementsTimeDropdown,
    setShowBodyMeasurementsTimeDropdown,
  ] = useState<boolean>(false);

  // Function to close all other dropdowns when opening one
  const closeAllDropdowns = () => {
    setShowBodyWeightTimeDropdown(false);
    setShowTotalVolumeTimeDropdown(false);
    setShowBodyFatTimeDropdown(false);
    setShowBodyMeasurementsTimeDropdown(false);
  };

  // Function to handle dropdown toggle without affecting data
  const toggleDropdown = (dropdownType: string) => {
    closeAllDropdowns();
    switch (dropdownType) {
      case "bodyWeight":
        setShowBodyWeightTimeDropdown(true);
        break;
      case "totalVolume":
        setShowTotalVolumeTimeDropdown(true);
        break;
      case "bodyFat":
        setShowBodyFatTimeDropdown(true);
        break;
      case "bodyMeasurements":
        setShowBodyMeasurementsTimeDropdown(true);
        break;
    }
  };

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

  // Group metrics by individual charts
  const bodyWeight = ["weight"];
  const totalVolume = ["volume"];
  const bodyFat = ["bodyfat"];
  const bodyMeasurements = ["arms", "chest", "shoulders", "neck", "quads"];

  // Memoize the filtered arrays to prevent unnecessary re-renders
  const selectedBodyWeight = useMemo(
    () => selectedMetrics.filter((metric) => bodyWeight.includes(metric)),
    [selectedMetrics]
  );
  const selectedTotalVolume = useMemo(
    () => selectedMetrics.filter((metric) => totalVolume.includes(metric)),
    [selectedMetrics]
  );
  const selectedBodyFat = useMemo(
    () => selectedMetrics.filter((metric) => bodyFat.includes(metric)),
    [selectedMetrics]
  );
  const selectedBodyMeasurements = useMemo(
    () => selectedMetrics.filter((metric) => bodyMeasurements.includes(metric)),
    [selectedMetrics]
  );

  // Seeded random function for stable data generation
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Helper function to calculate progression change
  const getProgressionChange = (data: any[]) => {
    if (!data || data.length < 2) return { change: 0, isIncrease: true };
    const firstValue = data[0]?.value || 0;
    const lastValue = data[data.length - 1]?.value || 0;
    const change = lastValue - firstValue;
    return { change: Math.abs(change), isIncrease: change >= 0 };
  };

  // Helper function to get body part name
  const getBodyPartName = (metric: string) => {
    const bodyPartNames: { [key: string]: string } = {
      arms: "arms",
      chest: "chest",
      shoulders: "shoulders",
      neck: "neck",
      quads: "quads",
    };
    return bodyPartNames[metric] || metric;
  };

  // Generate sample progression data based on time filter
  const chartData = useMemo(() => {
    const getDataPoints = (metrics: string[], timeFilterParam: string) => {
      const timeMultipliers: { [key: string]: number } = {
        "This Week": 7,
        "This Month": 30,
        "3 Months": 90,
        "6 Months": 180,
        "9 Months": 270,
        "This Year": 365,
        Lifetime: 1000,
      };

      const days = timeMultipliers[timeFilterParam] || 7;
      const step =
        timeFilterParam === "This Week"
          ? 1
          : Math.max(1, Math.floor(days / 10));

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

      // Generate data for each metric in the provided list
      const multiLineData = metrics.map((metric, metricIndex) => {
        const dataPoints = [];

        for (let i = 0; i < days; i += step) {
          let baseValue, value;

          if (metric === "weight") {
            baseValue = 83; // Starting weight
            const progression =
              Math.sin(i * 0.15 + metricIndex * 0.5) * 0.8 + 1;
            value =
              Math.round(
                (baseValue * progression + seededRandom(i + metricIndex) * 2) *
                  10
              ) / 10;
          } else if (metric === "volume") {
            baseValue = 1500;
            const progression =
              Math.sin(i * 0.12 + metricIndex * 0.3) * 0.6 + 1;
            value = Math.floor(
              baseValue * progression +
                seededRandom(i + metricIndex + 100) * 300
            );
          } else if (metric === "bodyfat") {
            baseValue = 15; // Starting body fat percentage
            const progression =
              Math.sin(i * 0.18 + metricIndex * 0.4) * 0.4 + 1;
            value =
              Math.round(
                (baseValue * progression +
                  seededRandom(i + metricIndex + 200) * 1.5) *
                  10
              ) / 10;
          } else if (metric === "arms") {
            baseValue = 35; // Starting arm circumference in cm
            const progression =
              Math.sin(i * 0.14 + metricIndex * 0.6) * 0.5 + 1;
            value =
              Math.round(
                (baseValue * progression +
                  seededRandom(i + metricIndex + 300) * 1.2) *
                  10
              ) / 10;
          } else if (metric === "chest") {
            baseValue = 100; // Starting chest circumference in cm
            const progression =
              Math.sin(i * 0.16 + metricIndex * 0.7) * 0.7 + 1;
            value =
              Math.round(
                (baseValue * progression +
                  seededRandom(i + metricIndex + 400) * 3) *
                  10
              ) / 10;
          } else if (metric === "shoulders") {
            baseValue = 120; // Starting shoulder circumference in cm
            const progression =
              Math.sin(i * 0.13 + metricIndex * 0.8) * 0.6 + 1;
            value =
              Math.round(
                (baseValue * progression +
                  seededRandom(i + metricIndex + 400) * 2.5) *
                  10
              ) / 10;
          } else if (metric === "neck") {
            baseValue = 40; // Starting neck circumference in cm
            const progression =
              Math.sin(i * 0.17 + metricIndex * 0.9) * 0.3 + 1;
            value =
              Math.round(
                (baseValue * progression +
                  seededRandom(i + metricIndex + 400) * 0.8) *
                  10
              ) / 10;
          } else if (metric === "quads") {
            baseValue = 60; // Starting quad circumference in cm
            const progression =
              Math.sin(i * 0.11 + metricIndex * 1.0) * 0.8 + 1;
            value =
              Math.round(
                (baseValue * progression +
                  seededRandom(i + metricIndex + 400) * 2) *
                  10
              ) / 10;
          } else {
            baseValue = 200;
            const progression = Math.sin(i * 0.1 + metricIndex * 0.5) * 0.5 + 1;
            value = Math.floor(
              baseValue * progression +
                seededRandom(i + metricIndex + 400) * 100
            );
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

    return {
      bodyWeight: getDataPoints(selectedBodyWeight, bodyWeightTimeFilter),
      totalVolume: getDataPoints(selectedTotalVolume, totalVolumeTimeFilter),
      bodyFat: getDataPoints(selectedBodyFat, bodyFatTimeFilter),
      bodyMeasurements: getDataPoints(
        selectedBodyMeasurements,
        bodyMeasurementsTimeFilter
      ),
    };
  }, [
    bodyWeightTimeFilter,
    totalVolumeTimeFilter,
    bodyFatTimeFilter,
    bodyMeasurementsTimeFilter,
    selectedBodyWeight,
    selectedTotalVolume,
    selectedBodyFat,
    selectedBodyMeasurements,
  ]);

  // Calculate current value and 30-day change for the first selected metric
  const currentValue = useMemo(() => {
    if (selectedMetrics.length === 0) return { value: 0, change: 0 };

    // Get the first selected metric data
    const firstMetric = selectedMetrics[0];
    let firstMetricData;

    if (bodyWeight.includes(firstMetric)) {
      firstMetricData = chartData.bodyWeight.find(
        (data) =>
          metricOptions.find((opt) => opt.key === firstMetric)?.label ===
          data.title
      );
    } else if (totalVolume.includes(firstMetric)) {
      firstMetricData = chartData.totalVolume.find(
        (data) =>
          metricOptions.find((opt) => opt.key === firstMetric)?.label ===
          data.title
      );
    } else if (bodyFat.includes(firstMetric)) {
      firstMetricData = chartData.bodyFat.find(
        (data) =>
          metricOptions.find((opt) => opt.key === firstMetric)?.label ===
          data.title
      );
    } else if (bodyMeasurements.includes(firstMetric)) {
      firstMetricData = chartData.bodyMeasurements.find(
        (data) =>
          metricOptions.find((opt) => opt.key === firstMetric)?.label ===
          data.title
      );
    }

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
    <View className="flex-1">
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

      {/* Selected Metrics Filter Tags */}
      {selectedMetrics.length > 0 && (
        <View className="px-4 mb-3">
          <View className="flex-row flex-wrap gap-2">
            {selectedMetrics.map((metric, index) => {
              const metricLabel =
                metricOptions.find((m) => m.key === metric)?.label || metric;
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
        </View>
      )}

      {/* Charts */}
      {selectedMetrics.length > 0 ? (
        <View>
          {/* Body Weight Chart (kg) */}
          {selectedBodyWeight.length > 0 && (
            <View className="px-4 mb-6">
              <View className="bg-gray-800 rounded-2xl p-6">
                {/* Progression Header */}
                <View className="mb-6">
                  <Text
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: "Outfit-Regular" }}
                  >
                    Progression (kg)
                  </Text>
                  <Text
                    className="text-2xl"
                    style={{
                      fontFamily: "Outfit-Bold",
                      color: getMetricColor(selectedMetrics.indexOf("weight")),
                    }}
                  >
                    {(() => {
                      const { change, isIncrease } = getProgressionChange(
                        chartData.bodyWeight[0]?.data || []
                      );
                      return `${isIncrease ? "+" : "-"}${change.toFixed(1)} kg`;
                    })()}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text
                      className="text-gray-400 text-sm"
                      style={{ fontFamily: "Outfit-Regular" }}
                    >
                      Last{" "}
                      {bodyWeightTimeFilter === "This Week"
                        ? "7"
                        : bodyWeightTimeFilter === "This Month"
                          ? "30"
                          : bodyWeightTimeFilter === "3 Months"
                            ? "90"
                            : bodyWeightTimeFilter === "6 Months"
                              ? "180"
                              : bodyWeightTimeFilter === "9 Months"
                                ? "270"
                                : bodyWeightTimeFilter === "This Year"
                                  ? "365"
                                  : "1000"}{" "}
                      days
                    </Text>
                  </View>
                </View>

                {/* Time Filter Dropdown */}
                <View className="flex-row items-center justify-between mb-4">
                  <Text
                    className="text-gray-300 text-lg"
                    style={{ fontFamily: "Outfit-SemiBold" }}
                  >
                    Body Weight (kg)
                  </Text>
                  <View className="relative">
                    <TouchableOpacity
                      className="flex-row items-center bg-gray-700 rounded-lg px-3 py-2"
                      onPress={() => toggleDropdown("bodyWeight")}
                    >
                      <Text
                        className="text-gray-300 text-sm mr-1"
                        style={{ fontFamily: "Outfit-Regular" }}
                      >
                        {bodyWeightTimeFilter}
                      </Text>
                      <Ionicons
                        name={
                          showBodyWeightTimeDropdown
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={14}
                        color="#9CA3AF"
                      />
                    </TouchableOpacity>

                    {showBodyWeightTimeDropdown && (
                      <View className="absolute top-10 right-0 bg-gray-700 rounded-lg p-2 min-w-32 z-10">
                        {timeFilterOptions.map((option) => (
                          <TouchableOpacity
                            key={option}
                            className={`py-2 px-3 rounded ${
                              bodyWeightTimeFilter === option
                                ? "bg-accent"
                                : "bg-transparent"
                            }`}
                            onPress={() => {
                              setBodyWeightTimeFilter(option);
                              setShowBodyWeightTimeDropdown(false);
                            }}
                          >
                            <Text
                              className={`text-sm ${
                                bodyWeightTimeFilter === option
                                  ? "text-black"
                                  : "text-gray-300"
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
                <View
                  style={{
                    position: "relative",
                    height: 300,
                    paddingBottom: 20,
                  }}
                >
                  {chartData.bodyWeight[0] && (
                    <LineChart
                      data={chartData.bodyWeight[0].data}
                      width={300}
                      height={280}
                      color={getMetricColor(selectedMetrics.indexOf("weight"))}
                      thickness={3}
                      startFillColor={getMetricColor(
                        selectedMetrics.indexOf("weight")
                      )}
                      endFillColor={getMetricColor(
                        selectedMetrics.indexOf("weight")
                      )}
                      startOpacity={0.8}
                      endOpacity={0.1}
                      initialSpacing={20}
                      endSpacing={20}
                      spacing={bodyWeightTimeFilter === "This Week" ? 50 : 30}
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
                      dataPointsColor={getMetricColor(
                        selectedMetrics.indexOf("weight")
                      )}
                      dataPointsRadius={4}
                      dataPointLabelComponent={() => null}
                      areaChart
                      onPress={(dataPoint: any) =>
                        handleDataPointPress(dataPoint, selectedBodyWeight[0])
                      }
                    />
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Total Volume Chart (kg) */}
          {selectedTotalVolume.length > 0 && (
            <View className="px-4 mb-6">
              <View className="bg-gray-800 rounded-2xl p-6">
                {/* Progression Header */}
                <View className="mb-6">
                  <Text
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: "Outfit-Regular" }}
                  >
                    Progression (kg)
                  </Text>
                  <Text
                    className="text-2xl"
                    style={{
                      fontFamily: "Outfit-Bold",
                      color: getMetricColor(selectedMetrics.indexOf("volume")),
                    }}
                  >
                    {(() => {
                      const { change, isIncrease } = getProgressionChange(
                        chartData.totalVolume[0]?.data || []
                      );
                      return `${isIncrease ? "+" : "-"}${change.toLocaleString()} kg`;
                    })()}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text
                      className="text-gray-400 text-sm"
                      style={{ fontFamily: "Outfit-Regular" }}
                    >
                      Last{" "}
                      {totalVolumeTimeFilter === "This Week"
                        ? "7"
                        : totalVolumeTimeFilter === "This Month"
                          ? "30"
                          : totalVolumeTimeFilter === "3 Months"
                            ? "90"
                            : totalVolumeTimeFilter === "6 Months"
                              ? "180"
                              : totalVolumeTimeFilter === "9 Months"
                                ? "270"
                                : totalVolumeTimeFilter === "This Year"
                                  ? "365"
                                  : "1000"}{" "}
                      days
                    </Text>
                  </View>
                </View>

                {/* Time Filter Dropdown */}
                <View className="flex-row items-center justify-between mb-4">
                  <Text
                    className="text-gray-300 text-lg"
                    style={{ fontFamily: "Outfit-SemiBold" }}
                  >
                    Total Volume (kg)
                  </Text>
                  <View className="relative">
                    <TouchableOpacity
                      className="flex-row items-center bg-gray-700 rounded-lg px-3 py-2"
                      onPress={() => toggleDropdown("totalVolume")}
                    >
                      <Text
                        className="text-gray-300 text-sm mr-1"
                        style={{ fontFamily: "Outfit-Regular" }}
                      >
                        {totalVolumeTimeFilter}
                      </Text>
                      <Ionicons
                        name={
                          showTotalVolumeTimeDropdown
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={14}
                        color="#9CA3AF"
                      />
                    </TouchableOpacity>

                    {showTotalVolumeTimeDropdown && (
                      <View className="absolute top-10 right-0 bg-gray-700 rounded-lg p-2 min-w-32 z-10">
                        {timeFilterOptions.map((option) => (
                          <TouchableOpacity
                            key={option}
                            className={`py-2 px-3 rounded ${
                              totalVolumeTimeFilter === option
                                ? "bg-accent"
                                : "bg-transparent"
                            }`}
                            onPress={() => {
                              setTotalVolumeTimeFilter(option);
                              setShowTotalVolumeTimeDropdown(false);
                            }}
                          >
                            <Text
                              className={`text-sm ${
                                totalVolumeTimeFilter === option
                                  ? "text-black"
                                  : "text-gray-300"
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
                <View
                  style={{
                    position: "relative",
                    height: 300,
                    paddingBottom: 20,
                  }}
                >
                  {chartData.totalVolume[0] && (
                    <LineChart
                      data={chartData.totalVolume[0].data}
                      width={300}
                      height={280}
                      color={getMetricColor(selectedMetrics.indexOf("volume"))}
                      thickness={3}
                      startFillColor={getMetricColor(
                        selectedMetrics.indexOf("volume")
                      )}
                      endFillColor={getMetricColor(
                        selectedMetrics.indexOf("volume")
                      )}
                      startOpacity={0.8}
                      endOpacity={0.1}
                      initialSpacing={20}
                      endSpacing={20}
                      spacing={totalVolumeTimeFilter === "This Week" ? 50 : 30}
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
                      dataPointsColor={getMetricColor(
                        selectedMetrics.indexOf("volume")
                      )}
                      dataPointsRadius={4}
                      dataPointLabelComponent={() => null}
                      areaChart
                      onPress={(dataPoint: any) =>
                        handleDataPointPress(dataPoint, selectedTotalVolume[0])
                      }
                    />
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Body Fat Chart (%) */}
          {selectedBodyFat.length > 0 && (
            <View className="px-4 mb-6">
              <View className="bg-gray-800 rounded-2xl p-6">
                {/* Progression Header */}
                <View className="mb-6">
                  <Text
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: "Outfit-Regular" }}
                  >
                    Progression (%)
                  </Text>
                  <Text
                    className="text-2xl"
                    style={{
                      fontFamily: "Outfit-Bold",
                      color: getMetricColor(selectedMetrics.indexOf("bodyfat")),
                    }}
                  >
                    {(() => {
                      const { change, isIncrease } = getProgressionChange(
                        chartData.bodyFat[0]?.data || []
                      );
                      return `${isIncrease ? "+" : "-"}${change.toFixed(1)}%`;
                    })()}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text
                      className="text-gray-400 text-sm"
                      style={{ fontFamily: "Outfit-Regular" }}
                    >
                      Last{" "}
                      {bodyFatTimeFilter === "This Week"
                        ? "7"
                        : bodyFatTimeFilter === "This Month"
                          ? "30"
                          : bodyFatTimeFilter === "3 Months"
                            ? "90"
                            : bodyFatTimeFilter === "6 Months"
                              ? "180"
                              : bodyFatTimeFilter === "9 Months"
                                ? "270"
                                : bodyFatTimeFilter === "This Year"
                                  ? "365"
                                  : "1000"}{" "}
                      days
                    </Text>
                  </View>
                </View>

                {/* Time Filter Dropdown */}
                <View className="flex-row items-center justify-between mb-4">
                  <Text
                    className="text-gray-300 text-lg"
                    style={{ fontFamily: "Outfit-SemiBold" }}
                  >
                    Body Fat (%)
                  </Text>
                  <View className="relative">
                    <TouchableOpacity
                      className="flex-row items-center bg-gray-700 rounded-lg px-3 py-2"
                      onPress={() => toggleDropdown("bodyFat")}
                    >
                      <Text
                        className="text-gray-300 text-sm mr-1"
                        style={{ fontFamily: "Outfit-Regular" }}
                      >
                        {bodyFatTimeFilter}
                      </Text>
                      <Ionicons
                        name={
                          showBodyFatTimeDropdown
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={14}
                        color="#9CA3AF"
                      />
                    </TouchableOpacity>

                    {showBodyFatTimeDropdown && (
                      <View className="absolute top-10 right-0 bg-gray-700 rounded-lg p-2 min-w-32 z-10">
                        {timeFilterOptions.map((option) => (
                          <TouchableOpacity
                            key={option}
                            className={`py-2 px-3 rounded ${
                              bodyFatTimeFilter === option
                                ? "bg-accent"
                                : "bg-transparent"
                            }`}
                            onPress={() => {
                              setBodyFatTimeFilter(option);
                              setShowBodyFatTimeDropdown(false);
                            }}
                          >
                            <Text
                              className={`text-sm ${
                                bodyFatTimeFilter === option
                                  ? "text-black"
                                  : "text-gray-300"
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
                <View
                  style={{
                    position: "relative",
                    height: 300,
                    paddingBottom: 20,
                  }}
                >
                  {chartData.bodyFat[0] && (
                    <LineChart
                      data={chartData.bodyFat[0].data}
                      width={300}
                      height={280}
                      color={getMetricColor(selectedMetrics.indexOf("bodyfat"))}
                      thickness={3}
                      startFillColor={getMetricColor(
                        selectedMetrics.indexOf("bodyfat")
                      )}
                      endFillColor={getMetricColor(
                        selectedMetrics.indexOf("bodyfat")
                      )}
                      startOpacity={0.8}
                      endOpacity={0.1}
                      initialSpacing={20}
                      endSpacing={20}
                      spacing={bodyFatTimeFilter === "This Week" ? 50 : 30}
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
                      dataPointsColor={getMetricColor(
                        selectedMetrics.indexOf("bodyfat")
                      )}
                      dataPointsRadius={4}
                      dataPointLabelComponent={() => null}
                      areaChart
                      onPress={(dataPoint: any) =>
                        handleDataPointPress(dataPoint, selectedBodyFat[0])
                      }
                    />
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Body Measurements Chart (cm) */}
          {selectedBodyMeasurements.length > 0 && (
            <View className="px-4 mb-6">
              <View className="bg-gray-800 rounded-2xl p-6">
                {/* Progression Header */}
                <View className="mb-6">
                  <Text
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: "Outfit-Regular" }}
                  >
                    Progression (cm)
                  </Text>
                  <View>
                    {selectedBodyMeasurements.map((metric, index) => {
                      const metricData = chartData.bodyMeasurements.find(
                        (data) =>
                          data.title ===
                          (metricOptions.find((opt) => opt.key === metric)
                            ?.label || metric)
                      );
                      if (!metricData) return null;

                      const { change, isIncrease } = getProgressionChange(
                        metricData.data || []
                      );
                      const bodyPart = getBodyPartName(metric);
                      const metricColor = getMetricColor(
                        selectedMetrics.indexOf(metric)
                      );

                      return (
                        <Text
                          key={metric}
                          className="text-2xl"
                          style={{
                            fontFamily: "Outfit-Bold",
                            color: metricColor,
                          }}
                        >
                          {`${isIncrease ? "+" : "-"}${change.toFixed(1)}cm ${isIncrease ? "on" : "off"} ${bodyPart}`}
                        </Text>
                      );
                    })}
                  </View>
                  <View className="flex-row items-center mt-1">
                    <Text
                      className="text-gray-400 text-sm"
                      style={{ fontFamily: "Outfit-Regular" }}
                    >
                      Last{" "}
                      {bodyMeasurementsTimeFilter === "This Week"
                        ? "7"
                        : bodyMeasurementsTimeFilter === "This Month"
                          ? "30"
                          : bodyMeasurementsTimeFilter === "3 Months"
                            ? "90"
                            : bodyMeasurementsTimeFilter === "6 Months"
                              ? "180"
                              : bodyMeasurementsTimeFilter === "9 Months"
                                ? "270"
                                : bodyMeasurementsTimeFilter === "This Year"
                                  ? "365"
                                  : "1000"}{" "}
                      days
                    </Text>
                  </View>
                </View>

                {/* Time Filter Dropdown */}
                <View className="flex-row items-center justify-between mb-4">
                  <Text
                    className="text-gray-300 text-lg"
                    style={{ fontFamily: "Outfit-SemiBold" }}
                  >
                    Body Measurements (cm)
                  </Text>
                  <View className="relative">
                    <TouchableOpacity
                      className="flex-row items-center bg-gray-700 rounded-lg px-3 py-2"
                      onPress={() => toggleDropdown("bodyMeasurements")}
                    >
                      <Text
                        className="text-gray-300 text-sm mr-1"
                        style={{ fontFamily: "Outfit-Regular" }}
                      >
                        {bodyMeasurementsTimeFilter}
                      </Text>
                      <Ionicons
                        name={
                          showBodyMeasurementsTimeDropdown
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={14}
                        color="#9CA3AF"
                      />
                    </TouchableOpacity>

                    {showBodyMeasurementsTimeDropdown && (
                      <View className="absolute top-10 right-0 bg-gray-700 rounded-lg p-2 min-w-32 z-10">
                        {timeFilterOptions.map((option) => (
                          <TouchableOpacity
                            key={option}
                            className={`py-2 px-3 rounded ${
                              bodyMeasurementsTimeFilter === option
                                ? "bg-accent"
                                : "bg-transparent"
                            }`}
                            onPress={() => {
                              setBodyMeasurementsTimeFilter(option);
                              setShowBodyMeasurementsTimeDropdown(false);
                            }}
                          >
                            <Text
                              className={`text-sm ${
                                bodyMeasurementsTimeFilter === option
                                  ? "text-black"
                                  : "text-gray-300"
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
                <View
                  style={{
                    position: "relative",
                    height: 300,
                    paddingBottom: 20,
                  }}
                >
                  {/* Primary chart with first body measurement */}
                  {chartData.bodyMeasurements[0] && (
                    <LineChart
                      data={chartData.bodyMeasurements[0].data}
                      width={300}
                      height={280}
                      color={getMetricColor(
                        selectedMetrics.indexOf(selectedBodyMeasurements[0])
                      )}
                      thickness={3}
                      startFillColor={getMetricColor(
                        selectedMetrics.indexOf(selectedBodyMeasurements[0])
                      )}
                      endFillColor={getMetricColor(
                        selectedMetrics.indexOf(selectedBodyMeasurements[0])
                      )}
                      startOpacity={0.8}
                      endOpacity={0.1}
                      initialSpacing={20}
                      endSpacing={20}
                      spacing={
                        bodyMeasurementsTimeFilter === "This Week" ? 50 : 30
                      }
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
                      dataPointsColor={getMetricColor(
                        selectedMetrics.indexOf(selectedBodyMeasurements[0])
                      )}
                      dataPointsRadius={4}
                      dataPointLabelComponent={() => null}
                      areaChart
                      onPress={(dataPoint: any) =>
                        handleDataPointPress(
                          dataPoint,
                          selectedBodyMeasurements[0]
                        )
                      }
                    />
                  )}

                  {/* Overlay additional body measurement lines */}
                  {chartData.bodyMeasurements
                    .slice(1)
                    .map((lineData, index) => {
                      const metricKey = selectedBodyMeasurements[index + 1];
                      const metricColor = getMetricColor(
                        selectedMetrics.indexOf(metricKey)
                      );
                      return (
                        <View
                          key={lineData.title}
                          style={{ position: "absolute", top: 0, left: 0 }}
                        >
                          <LineChart
                            data={lineData.data}
                            width={300}
                            height={280}
                            color={metricColor}
                            thickness={4}
                            startFillColor={metricColor}
                            endFillColor={metricColor}
                            startOpacity={0.4}
                            endOpacity={0.05}
                            initialSpacing={20}
                            endSpacing={20}
                            spacing={
                              bodyMeasurementsTimeFilter === "This Week"
                                ? 50
                                : 30
                            }
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
                            dataPointsColor={metricColor}
                            dataPointsRadius={5}
                            dataPointLabelComponent={() => null}
                            areaChart
                            onPress={(dataPoint: any) =>
                              handleDataPointPress(dataPoint, lineData.title)
                            }
                          />
                        </View>
                      );
                    })}

                  {/* Top layer with just the lines and data points for body measurements */}
                  {chartData.bodyMeasurements
                    .slice(1)
                    .map((lineData, index) => {
                      const metricKey = selectedBodyMeasurements[index + 1];
                      const metricColor = getMetricColor(
                        selectedMetrics.indexOf(metricKey)
                      );
                      return (
                        <View
                          key={`line-${lineData.title}`}
                          style={{ position: "absolute", top: 0, left: 0 }}
                        >
                          <LineChart
                            data={lineData.data}
                            width={300}
                            height={280}
                            color={metricColor}
                            thickness={3}
                            startFillColor="transparent"
                            endFillColor="transparent"
                            startOpacity={0}
                            endOpacity={0}
                            initialSpacing={20}
                            endSpacing={20}
                            spacing={
                              bodyMeasurementsTimeFilter === "This Week"
                                ? 50
                                : 30
                            }
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
                            dataPointsColor={metricColor}
                            dataPointsRadius={5}
                            dataPointLabelComponent={() => null}
                            areaChart={false}
                            onPress={(dataPoint: any) =>
                              handleDataPointPress(dataPoint, lineData.title)
                            }
                          />
                        </View>
                      );
                    })}
                </View>
              </View>
            </View>
          )}
        </View>
      ) : (
        <View className="px-4 mb-6">
          <View className="bg-gray-800 rounded-2xl p-6">
            <View className="items-center justify-center h-48">
              <Text
                className="text-gray-400 text-base text-center"
                style={{ fontFamily: "Outfit-Regular" }}
              >
                No progression data available
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ProgressionChart;
