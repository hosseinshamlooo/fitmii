import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ExerciseTrackerProps {
  onBack: () => void;
  onHome: () => void;
  exerciseName: string;
}

const ExerciseTracker: React.FC<ExerciseTrackerProps> = ({
  onBack,
  onHome,
  exerciseName,
}) => {
  const [activeTab, setActiveTab] = useState("TRACK");
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(0);
  const [savedSets, setSavedSets] = useState<
    Array<{ weight: number; reps: number; setNumber: number }>
  >([]);

  const handleWeightChange = (change: number) => {
    const newWeight = weight + change;
    if (newWeight >= 0) {
      setWeight(Math.round(newWeight * 10) / 10); // Round to 1 decimal place
    }
  };

  const handleRepsChange = (change: number) => {
    const newReps = reps + change;
    if (newReps >= 0) {
      setReps(newReps);
    }
  };

  const handleSave = () => {
    console.log(`Saved: ${weight} kgs, ${reps} reps for ${exerciseName}`);
    const newSet = {
      weight: weight,
      reps: reps,
      setNumber: savedSets.length + 1,
    };
    setSavedSets([...savedSets, newSet]);
    // TODO: Save to database
  };

  const handleClear = () => {
    setWeight(0);
    setReps(0);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View>
        <View className="bg-gray-800 rounded-2xl p-6 pt-16">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <TouchableOpacity onPress={onBack} className="mr-3">
                <Ionicons name="menu" size={24} color="#17e1c5" />
              </TouchableOpacity>
              <Text
                className="text-white text-2xl flex-1"
                style={{ fontFamily: "Outfit-Bold" }}
                numberOfLines={1}
              >
                {exerciseName}
              </Text>
            </View>
            <View className="flex-row items-end gap-6 ml-[-200]">
              <TouchableOpacity>
                <Ionicons name="time" size={20} color="#17e1c5" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="trophy" size={20} color="#17e1c5" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="information-circle" size={20} color="#17e1c5" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="ellipsis-vertical" size={20} color="#17e1c5" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Segmented Control */}
          <View className="bg-gray-700 rounded-3xl p-1">
            <View className="flex-row ">
              {["TRACK", "HISTORY", "GRAPH"].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  className="flex-1 py-3 rounded-lg"
                  onPress={() => setActiveTab(tab)}
                  style={{ zIndex: 1 }}
                >
                  <Text
                    className={`text-center text-sm ${
                      activeTab === tab
                        ? "text-white font-semibold"
                        : "text-gray-400"
                    }`}
                    style={{
                      fontFamily:
                        activeTab === tab ? "Outfit-SemiBold" : "Outfit-Medium",
                    }}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Active indicator */}
            <View
              className="absolute bg-accent w-1/3 rounded-3xl"
              style={{
                left:
                  activeTab === "TRACK"
                    ? 4
                    : activeTab === "HISTORY"
                      ? "33.33%"
                      : "66.66%",
                top: 3,
                height: 40,
                zIndex: 0,
              }}
            />
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 px-4 py-3">
        {activeTab === "TRACK" && (
          <View>
            {/* Weight Section */}
            <View className="mb-8">
              <Text
                className="text-white text-sm mb-2"
                style={{ fontFamily: "Outfit-Medium" }}
              >
                WEIGHT (kgs)
              </Text>
              <View className="h-0.5 bg-accent mb-4" />
              <View className="flex-row items-center justify-center">
                <TouchableOpacity
                  className="w-12 h-12 bg-gray-800 rounded-2xl items-center justify-center mr-4"
                  onPress={() => handleWeightChange(-0.5)}
                >
                  <Ionicons name="remove" size={20} color="#17e1c5" />
                </TouchableOpacity>
                <TextInput
                  className="w-24 h-12 bg-gray-800 rounded-3xl text-center text-white text-lg mx-2"
                  style={{ fontFamily: "Outfit-Bold" }}
                  value={weight === 0 ? "" : weight.toString()}
                  placeholder="0"
                  placeholderTextColor="#6b7280"
                  onChangeText={(text) => {
                    if (text === "") {
                      setWeight(0);
                    } else {
                      const num = parseFloat(text);
                      if (!isNaN(num) && num >= 0) {
                        setWeight(num);
                      }
                    }
                  }}
                  keyboardType="numeric"
                  selectTextOnFocus
                />
                <TouchableOpacity
                  className="w-12 h-12 bg-gray-800 rounded-2xl items-center justify-center ml-4"
                  onPress={() => handleWeightChange(0.5)}
                >
                  <Ionicons name="add" size={20} color="#17e1c5" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Reps Section */}
            <View className="mb-8">
              <Text
                className="text-white text-sm mb-2"
                style={{ fontFamily: "Outfit-Medium" }}
              >
                REPS
              </Text>
              <View className="h-0.5 bg-accent mb-4" />
              <View className="flex-row items-center justify-center">
                <TouchableOpacity
                  className="w-12 h-12 bg-gray-800 rounded-2xl items-center justify-center mr-4"
                  onPress={() => handleRepsChange(-1)}
                >
                  <Ionicons name="remove" size={20} color="#17e1c5" />
                </TouchableOpacity>
                <TextInput
                  className="w-24 h-12 bg-gray-800 rounded-3xl text-center text-white text-lg mx-2"
                  style={{ fontFamily: "Outfit-Bold" }}
                  value={reps === 0 ? "" : reps.toString()}
                  placeholder="0"
                  placeholderTextColor="#6b7280"
                  onChangeText={(text) => {
                    if (text === "") {
                      setReps(0);
                    } else {
                      const num = parseInt(text);
                      if (!isNaN(num) && num >= 0) {
                        setReps(num);
                      }
                    }
                  }}
                  keyboardType="numeric"
                  selectTextOnFocus
                />
                <TouchableOpacity
                  className="w-12 h-12 bg-gray-800 rounded-2xl items-center justify-center ml-4"
                  onPress={() => handleRepsChange(1)}
                >
                  <Ionicons name="add" size={20} color="#17e1c5" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-4 mb-6">
              <TouchableOpacity
                className="flex-1 bg-accent rounded-3xl py-4 items-center"
                onPress={handleSave}
              >
                <Text
                  className="text-black text-base"
                  style={{ fontFamily: "Outfit-Bold" }}
                >
                  SAVE
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-blue-500 rounded-3xl py-4 items-center"
                onPress={handleClear}
              >
                <Text
                  className="text-white text-base"
                  style={{ fontFamily: "Outfit-Bold" }}
                >
                  CLEAR
                </Text>
              </TouchableOpacity>
            </View>

            {/* Saved Data Display */}
            {savedSets.length > 0 && (
              <View className="mb-4">
                {savedSets.map((set, index) => (
                  <View key={index} className="bg-gray-800 rounded-lg p-4 mb-3">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-4">
                        <TouchableOpacity>
                          <Ionicons
                            name="chatbubble-outline"
                            size={20}
                            color="#6b7280"
                          />
                        </TouchableOpacity>
                        <View className="flex-row items-center gap-2">
                          <Ionicons name="trophy" size={20} color="#3b82f6" />
                          <Text
                            className="text-white text-sm"
                            style={{ fontFamily: "Outfit-Medium" }}
                          >
                            {set.setNumber}
                          </Text>
                        </View>
                        <Text
                          className="text-white text-sm"
                          style={{ fontFamily: "Outfit-Medium" }}
                        >
                          {set.weight} kgs
                        </Text>
                        <Text
                          className="text-white text-sm"
                          style={{ fontFamily: "Outfit-Medium" }}
                        >
                          {set.reps} reps
                        </Text>
                      </View>
                    </View>
                    <View className="h-0.5 bg-gray-700 mt-3" />
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === "HISTORY" && (
          <View className="flex-1 items-center justify-center">
            <Text
              className="text-gray-400 text-lg"
              style={{ fontFamily: "Outfit-Regular" }}
            >
              No history yet
            </Text>
          </View>
        )}

        {activeTab === "GRAPH" && (
          <View className="flex-1 items-center justify-center">
            <Text
              className="text-gray-400 text-lg"
              style={{ fontFamily: "Outfit-Regular" }}
            >
              No data to display
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExerciseTracker;
