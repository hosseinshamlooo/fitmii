import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ExerciseHistory from "../../components/ExerciseHistory";
import ExerciseProgressionChart from "../../components/ExerciseProgressionChart";

interface ExerciseTrackerProps {
  onBack: (
    savedSets?: Array<{
      weight: number;
      reps: number;
      setNumber: number;
      date: string;
      comment?: string;
      isPersonalRecord?: boolean;
    }>
  ) => void;
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
    Array<{
      weight: number;
      reps: number;
      setNumber: number;
      date: string;
      comment?: string;
      isPersonalRecord?: boolean;
    }>
  >([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedSetIndex, setSelectedSetIndex] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");
  const slideAnimation = useRef(new Animated.Value(0)).current;

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

    // Check if this exact combination already exists (to avoid duplicate PRs)
    const exactMatchExists = savedSets.some(
      (set) => set.weight === weight && set.reps === reps
    );

    // Check if this is a personal record
    let isPersonalRecord = false;

    if (savedSets.length === 0) {
      // First set ever is always a PR
      isPersonalRecord = true;
    } else if (!exactMatchExists) {
      // Find the best previous performance
      const bestPrevious = savedSets.reduce((best, set) => {
        if (set.weight > best.weight) {
          return set;
        } else if (set.weight === best.weight && set.reps > best.reps) {
          return set;
        }
        return best;
      }, savedSets[0]);

      // Check if current set is better than the best previous
      isPersonalRecord =
        weight > bestPrevious.weight ||
        (weight === bestPrevious.weight && reps > bestPrevious.reps);
    }

    // Create new set
    const newSet = {
      weight: weight,
      reps: reps,
      setNumber: savedSets.length + 1,
      date: new Date().toISOString(),
      isPersonalRecord: isPersonalRecord,
    };

    // If this is a new PR, remove PR status from all previous sets
    let updatedSets = [...savedSets];
    if (isPersonalRecord) {
      updatedSets = updatedSets.map((set) => ({
        ...set,
        isPersonalRecord: false,
      }));
    }

    setSavedSets([...updatedSets, newSet]);
    // TODO: Save to database
  };

  const handleClear = () => {
    setWeight(0);
    setReps(0);
  };

  const handleCommentPress = (setIndex: number) => {
    setSelectedSetIndex(setIndex);
    setCommentText(savedSets[setIndex].comment || "");
    setShowCommentModal(true);
  };

  const handleSaveComment = () => {
    if (selectedSetIndex !== null) {
      const updatedSets = [...savedSets];
      updatedSets[selectedSetIndex].comment = commentText;
      setSavedSets(updatedSets);
      setShowCommentModal(false);
      setCommentText("");
      setSelectedSetIndex(null);
    }
  };

  const handleCancelComment = () => {
    setShowCommentModal(false);
    setCommentText("");
    setSelectedSetIndex(null);
  };

  const handleTabChange = (tab: string) => {
    const tabIndex = ["TRACK", "HISTORY", "GRAPH"].indexOf(tab);
    setActiveTab(tab);

    Animated.timing(slideAnimation, {
      toValue: tabIndex,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  // Initialize animation value based on current active tab
  React.useEffect(() => {
    const initialIndex = ["TRACK", "HISTORY", "GRAPH"].indexOf(activeTab);
    slideAnimation.setValue(initialIndex);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View>
        <View className="bg-gray-800 rounded-2xl p-6 pt-16">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => {
                  console.log("ExerciseTracker sending savedSets:", savedSets);
                  onBack(savedSets);
                }}
                className="mr-3"
              >
                <Ionicons name="menu" size={22} color="#17e1c5" />
              </TouchableOpacity>
              <Text
                className="text-white text-xl flex-1"
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
            <View className="flex-row relative">
              {["TRACK", "HISTORY", "GRAPH"].map((tab, index) => (
                <TouchableOpacity
                  key={tab}
                  className="flex-1 py-3 rounded-lg"
                  onPress={() => handleTabChange(tab)}
                  style={{ zIndex: 1 }}
                >
                  <Text
                    className={`text-center text-sm ${
                      activeTab === tab
                        ? "text-gray-800 font-semibold"
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
            {/* Animated Active indicator */}
            <Animated.View
              className="absolute bg-accent rounded-3xl"
              style={{
                transform: [
                  {
                    translateX: slideAnimation.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [0, 120, 240], // Adjust these values based on your container width
                    }),
                  },
                ],
                width: "33.33%",
                top: 3,
                height: 40,
                zIndex: 0,
                left: 4,
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
                    <View className="flex-row items-center justify-between relative">
                      <View className="flex-row items-center gap-4">
                        <TouchableOpacity
                          onPress={() => handleCommentPress(index)}
                        >
                          <Ionicons
                            name={
                              set.comment ? "chatbubble" : "chatbubble-outline"
                            }
                            size={20}
                            color={set.comment ? "#17e1c5" : "#6b7280"}
                          />
                        </TouchableOpacity>
                        <View className="flex-row items-center gap-2">
                          <Text
                            className="text-white text-sm"
                            style={{ fontFamily: "Outfit-Bold" }}
                          >
                            {set.setNumber}
                          </Text>
                          {set.isPersonalRecord && (
                            <Ionicons name="trophy" size={20} color="#17e1c5" />
                          )}
                        </View>
                      </View>

                      {/* Centered Weight */}
                      <View className="absolute left-1/2 transform -translate-x-1/2">
                        <Text
                          className="text-white text-sm"
                          style={{ fontFamily: "Outfit-Medium" }}
                        >
                          {set.weight} kgs
                        </Text>
                      </View>

                      <Text
                        className="text-white text-sm"
                        style={{ fontFamily: "Outfit-Medium" }}
                      >
                        {set.reps} reps
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === "HISTORY" && (
          <ExerciseHistory exerciseName={exerciseName} savedSets={savedSets} />
        )}

        {activeTab === "GRAPH" && (
          <ExerciseProgressionChart
            exerciseName={exerciseName}
            savedSets={savedSets}
          />
        )}
      </ScrollView>

      {/* Comment Modal */}
      <Modal
        visible={showCommentModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelComment}
        statusBarTranslucent={true}
        presentationStyle="overFullScreen"
      >
        <View
          className="flex-1 bg-black/70 justify-center items-center px-6"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: "100%",
            width: "100%",
          }}
        >
          <View className="bg-gray-800 rounded-lg p-6 w-full max-w-sm">
            <Text
              className="text-accent text-lg mb-4"
              style={{ fontFamily: "Outfit-SemiBold" }}
            >
              Comment
            </Text>

            <TextInput
              className="bg-gray-700 rounded-lg p-3 text-white text-base mb-6"
              style={{ fontFamily: "Outfit-Regular" }}
              placeholder="Comment Text ..."
              placeholderTextColor="#6b7280"
              value={commentText}
              onChangeText={setCommentText}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-700 rounded-lg py-3 items-center"
                onPress={handleCancelComment}
              >
                <Text
                  className="text-white text-base"
                  style={{ fontFamily: "Outfit-Medium" }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-accent rounded-lg py-3 items-center"
                onPress={handleSaveComment}
              >
                <Text
                  className="text-black text-base"
                  style={{ fontFamily: "Outfit-Medium" }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ExerciseTracker;
