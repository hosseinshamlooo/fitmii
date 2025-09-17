import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Modal,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import MuscleGroups from "./MuscleGroups";
import AllExercises from "./AllExercises";
import ExerciseTracker from "./ExerciseTracker";

interface SavedSet {
  weight: number;
  reps: number;
  setNumber: number;
  date: string;
  comment?: string;
  isPersonalRecord?: boolean;
}

const AddWorkout = ({
  onBack,
  onHome,
  currentScreen,
  setCurrentScreen,
  savedWorkouts,
  setSavedWorkouts,
}: {
  onBack: () => void;
  onHome: () => void;
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  savedWorkouts: Array<{
    exerciseName: string;
    sets: SavedSet[];
  }>;
  setSavedWorkouts: React.Dispatch<
    React.SetStateAction<
      Array<{
        exerciseName: string;
        sets: SavedSet[];
      }>
    >
  >;
}) => {
  const [showAllExercises, setShowAllExercises] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(
    null
  );
  const [editingExercise, setEditingExercise] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedSet, setSelectedSet] = useState<SavedSet | null>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Format date for display
  const formatDateDisplay = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    }
  };

  // Navigate to previous day with animation
  const goToPreviousDay = () => {
    // Slide out to the right
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Update date
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 1);
      setCurrentDate(newDate);

      // Reset animation and slide in from left
      slideAnim.setValue(-1);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  // Navigate to next day with animation
  const goToNextDay = () => {
    // Slide out to the left
    Animated.timing(slideAnim, {
      toValue: -1,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Update date
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 1);
      setCurrentDate(newDate);

      // Reset animation and slide in from right
      slideAnim.setValue(1);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  // Get workouts for current date (for now, only show workouts for today)
  const getCurrentDateWorkouts = () => {
    const today = new Date();
    if (currentDate.toDateString() === today.toDateString()) {
      return savedWorkouts;
    }
    // Return empty array for other dates (each day starts fresh)
    return [];
  };

  const currentDateWorkouts = getCurrentDateWorkouts();

  // Handle comment press
  const handleCommentPress = (set: SavedSet) => {
    setSelectedSet(set);
    setShowCommentModal(true);
  };

  // Handle close comment modal
  const handleCloseComment = () => {
    setShowCommentModal(false);
    setSelectedSet(null);
  };

  // Handle swipe gestures for date navigation
  const handleSwipeGesture = (event: any) => {
    const { translationX, state } = event.nativeEvent;

    if (state === State.END) {
      const swipeThreshold = 50; // Minimum swipe distance

      if (translationX > swipeThreshold) {
        // Swipe right - go to previous day
        console.log("Swipe right - going to previous day");
        goToPreviousDay();
      } else if (translationX < -swipeThreshold) {
        // Swipe left - go to next day
        console.log("Swipe left - going to next day");
        goToNextDay();
      }
    }
  };

  // Handle device back button
  useEffect(() => {
    const backAction = () => {
      if (showAllExercises) {
        setShowAllExercises(false);
        return true; // Prevent default behavior
      }
      onBack();
      return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [onBack, showAllExercises]);

  // Show muscle groups when currentScreen is "muscleGroups"
  if (currentScreen === "muscleGroups") {
    return (
      <MuscleGroups
        onBack={() => setCurrentScreen("addWorkout")}
        onHome={onHome}
        onMuscleGroupSelect={(muscleGroup) => {
          setSelectedMuscleGroup(muscleGroup);
          setCurrentScreen("exercises");
        }}
      />
    );
  }

  // Show ExerciseTracker directly when editing an existing exercise
  if (editingExercise) {
    const existingWorkout = savedWorkouts.find(
      (workout) => workout.exerciseName === editingExercise
    );

    return (
      <ExerciseTracker
        onBack={(
          savedSets?: Array<{
            weight: number;
            reps: number;
            setNumber: number;
            date: string;
            comment?: string;
            isPersonalRecord?: boolean;
          }>
        ) => {
          console.log("AddWorkout received from ExerciseTracker:", {
            savedSets,
            editingExercise,
          });
          if (savedSets && savedSets.length > 0) {
            // Update the saved sets for this exercise
            setSavedWorkouts((prev) => {
              // Remove any existing entry for this exercise and add the new one
              const filtered = prev.filter(
                (workout) => workout.exerciseName !== editingExercise
              );
              const newWorkouts = [
                ...filtered,
                { exerciseName: editingExercise, sets: savedSets },
              ];
              console.log("Updated savedWorkouts:", newWorkouts);
              return newWorkouts;
            });
          }
          setEditingExercise(null);
          setCurrentScreen("addWorkout");
        }}
        onHome={onHome}
        exerciseName={editingExercise}
        initialSets={existingWorkout?.sets || []}
      />
    );
  }

  // Show specific exercises when currentScreen is "exercises"
  if (currentScreen === "exercises" && selectedMuscleGroup) {
    return (
      <AllExercises
        onBack={(savedSets, exerciseName) => {
          console.log("AddWorkout received:", { savedSets, exerciseName });
          if (savedSets && exerciseName) {
            // Add the saved sets to our workout list
            setSavedWorkouts((prev) => {
              // Remove any existing entry for this exercise and add the new one
              const filtered = prev.filter(
                (workout) => workout.exerciseName !== exerciseName
              );
              const newWorkouts = [
                ...filtered,
                { exerciseName, sets: savedSets },
              ];
              console.log("Updated savedWorkouts:", newWorkouts);
              return newWorkouts;
            });
          }
          setCurrentScreen("addWorkout");
        }}
        onHome={onHome}
        muscleGroup={selectedMuscleGroup}
        savedWorkouts={savedWorkouts}
      />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onHandlerStateChange={handleSwipeGesture}>
        <View className="flex-1 bg-gray-900">
          {/* Header */}
          <View>
            <View className="bg-gray-800 rounded-2xl p-6 pt-20 mt-[-12]">
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center">
                  <TouchableOpacity onPress={onBack} className="mr-3">
                    <Ionicons name="chevron-back" size={22} color="#17e1c5" />
                  </TouchableOpacity>
                  <Text
                    className="text-white text-xl flex-1"
                    style={{ fontFamily: "Outfit-Bold" }}
                    numberOfLines={1}
                  >
                    Add Workout
                  </Text>
                </View>
                <View className="flex-row items-center gap-4 ml-[-200]">
                  <TouchableOpacity>
                    <Ionicons name="calendar" size={20} color="#17e1c5" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setCurrentScreen("muscleGroups")}
                  >
                    <Ionicons name="add" size={20} color="#17e1c5" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons
                      name="ellipsis-vertical"
                      size={20}
                      color="#17e1c5"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Date Navigation */}
              <View className="bg-gray-700 rounded-3xl">
                <View className="flex-row items-center justify-between px-4 py-3">
                  <TouchableOpacity onPress={goToPreviousDay}>
                    <Ionicons name="chevron-back" size={20} color="#17e1c5" />
                  </TouchableOpacity>
                  <Text
                    className="text-white text-lg text-center flex-1"
                    style={{ fontFamily: "Outfit-SemiBold" }}
                  >
                    {formatDateDisplay(currentDate)}
                  </Text>
                  <TouchableOpacity onPress={goToNextDay}>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#17e1c5"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Main Content */}
          <Animated.View
            style={{
              flex: 1,
              transform: [
                {
                  translateX: slideAnim.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [-300, 0, 300],
                  }),
                },
              ],
            }}
          >
            {currentDateWorkouts.length === 0 ? (
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
                    console.log("Start New Workout - Opening MuscleGroups");
                    setCurrentScreen("muscleGroups");
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
            ) : (
              <View className="flex-1 px-4 py-3">
                {currentDateWorkouts.map((workout, index) => (
                  <View key={index} className="mb-4">
                    {/* Exercise Card Container with Split Clickable Areas */}
                    <View className="bg-gray-800 rounded-lg p-4">
                      {/* Left 1/6 - Non-clickable area */}
                      <View className="absolute top-0 left-0 bottom-0 w-1/6 z-10 pointer-events-none" />

                      {/* Clickable area to open ExerciseTracker - only responds to right 5/6 */}
                      <TouchableOpacity
                        className="w-full"
                        onPress={(e) => {
                          // Only trigger if click is in the right 5/6 of the card
                          const { locationX } = e.nativeEvent;
                          const cardWidth = 300; // approximate card width
                          const leftSixthWidth = cardWidth / 6;

                          if (locationX > leftSixthWidth) {
                            console.log(
                              `Opening ExerciseTracker for: ${workout.exerciseName}`
                            );
                            setEditingExercise(workout.exerciseName);
                          } else {
                            console.log("Click in left 1/6 - ignoring");
                          }
                        }}
                        activeOpacity={0.7}
                      >
                        {/* Exercise Name with Accent Line Above */}
                        <Text
                          className="text-white text-xl mb-4"
                          style={{ fontFamily: "Outfit-SemiBold" }}
                        >
                          {workout.exerciseName}
                        </Text>

                        {/* Display Sets - Compact format */}
                        {workout.sets.map((set, setIndex) => (
                          <View
                            key={setIndex}
                            className={`flex-row items-center justify-between relative py-2 ${
                              setIndex < workout.sets.length - 1
                                ? "border-b border-gray-700"
                                : ""
                            }`}
                          >
                            {/* Left: Set number, comment, trophy */}
                            <View className="flex-row items-center gap-2">
                              <Text
                                className="text-white text-lg"
                                style={{ fontFamily: "Outfit-Bold" }}
                              >
                                {set.setNumber}
                              </Text>
                              <TouchableOpacity
                                onPress={(e) => {
                                  console.log("Chat bubble clicked!", {
                                    set,
                                    hasComment: !!set.comment,
                                  });
                                  e.stopPropagation();
                                  if (set.comment) {
                                    console.log(
                                      "Opening comment modal for:",
                                      set.comment
                                    );
                                    handleCommentPress(set);
                                  } else {
                                    console.log("No comment to show");
                                  }
                                }}
                                className="p-2 -m-2"
                              >
                                <Ionicons
                                  name={
                                    set.comment
                                      ? "chatbubble"
                                      : "chatbubble-outline"
                                  }
                                  size={18}
                                  color={set.comment ? "#17e1c5" : "#6b7280"}
                                />
                              </TouchableOpacity>
                              {set.isPersonalRecord && (
                                <Ionicons
                                  name="trophy"
                                  size={18}
                                  color="#17e1c5"
                                />
                              )}
                            </View>

                            {/* Center: Weight */}
                            <View className="absolute left-1/2 transform -translate-x-1/2">
                              <Text
                                className="text-white text-lg"
                                style={{ fontFamily: "Outfit-Medium" }}
                              >
                                {set.weight} kgs
                              </Text>
                            </View>

                            {/* Right: Reps */}
                            <Text
                              className="text-white text-lg"
                              style={{ fontFamily: "Outfit-Medium" }}
                            >
                              {set.reps} reps
                            </Text>
                          </View>
                        ))}
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </Animated.View>

          {/* Comment Display Modal */}
          <Modal
            visible={showCommentModal}
            transparent={true}
            animationType="fade"
            onRequestClose={handleCloseComment}
            statusBarTranslucent={true}
            presentationStyle="overFullScreen"
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 24,
                paddingTop: 0,
                paddingBottom: 0,
              }}
            >
              <View className="bg-gray-800 rounded-lg p-6 w-full max-w-sm">
                <Text
                  className="text-accent text-lg mb-4"
                  style={{ fontFamily: "Outfit-SemiBold" }}
                >
                  Comment
                </Text>

                <View className="bg-gray-700 rounded-lg p-3 mb-6 min-h-[80px]">
                  <Text
                    className="text-white text-base"
                    style={{ fontFamily: "Outfit-Regular" }}
                  >
                    {selectedSet?.comment || "No comment available"}
                  </Text>
                </View>

                <TouchableOpacity
                  className="w-full bg-accent rounded-lg py-3 items-center"
                  onPress={handleCloseComment}
                >
                  <Text
                    className="text-black text-base"
                    style={{ fontFamily: "Outfit-Medium" }}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default AddWorkout;
