import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
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

  // Navigate to previous day
  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  // Navigate to next day
  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
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
                <Ionicons name="ellipsis-vertical" size={20} color="#17e1c5" />
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
                <Ionicons name="chevron-forward" size={20} color="#17e1c5" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Main Content */}
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
            <TouchableOpacity
              key={index}
              className="mb-4"
              onPress={() => {
                console.log(
                  `Opening ExerciseTracker for: ${workout.exerciseName}`
                );
                setEditingExercise(workout.exerciseName);
                // Note: We don't need the muscle group mapping anymore since we're going directly to ExerciseTracker
                /*
                const exerciseToMuscleGroup: { [key: string]: string } = {
                  // Abs
                  "Ab-Wheel Rollout": "Abs",
                  "Cable Crunch": "Abs",
                  Crunch: "Abs",
                  "Crunch Machine": "Abs",
                  "Decline Crunch": "Abs",
                  "Dragon Flag": "Abs",
                  "Elbow Support Leg Raise": "Abs",
                  "Hanging Knee Raise": "Abs",
                  "Hanging Leg Raise": "Abs",
                  Plank: "Abs",
                  "Plate Crunch Machine": "Abs",
                  "Russian Twist w Medicine Ball": "Abs",
                  "Side Plank": "Abs",
                  // Back
                  "Barbell Row": "Back",
                  "Cable Row": "Back",
                  Deadlift: "Back",
                  "Lat Pulldown": "Back",
                  "Pull-up": "Back",
                  "Seated Cable Row": "Back",
                  "T-Bar Row": "Back",
                  "Wide-Grip Pull-up": "Back",
                  "Bent-Over Row": "Back",
                  "One-Arm Dumbbell Row": "Back",
                  // Biceps
                  "Barbell Curl": "Biceps",
                  "Dumbbell Curl": "Biceps",
                  "Hammer Curl": "Biceps",
                  "Cable Curl": "Biceps",
                  "Preacher Curl": "Biceps",
                  "Concentration Curl": "Biceps",
                  "Incline Dumbbell Curl": "Biceps",
                  "21s": "Biceps",
                  "Spider Curl": "Biceps",
                  "Reverse Curl": "Biceps",
                  // Cardio
                  Running: "Cardio",
                  Cycling: "Cardio",
                  Swimming: "Cardio",
                  Rowing: "Cardio",
                  Elliptical: "Cardio",
                  "Jump Rope": "Cardio",
                  Burpees: "Cardio",
                  "Mountain Climbers": "Cardio",
                  "High Knees": "Cardio",
                  "Jumping Jacks": "Cardio",
                  // Chest
                  "Bench Press": "Chest",
                  "Incline Bench Press": "Chest",
                  "Decline Bench Press": "Chest",
                  "Dumbbell Press": "Chest",
                  "Push-up": "Chest",
                  "Cable Fly": "Chest",
                  "Dumbbell Fly": "Chest",
                  Dips: "Chest",
                  "Pec Deck": "Chest",
                  "Incline Dumbbell Fly": "Chest",
                  // Forearms
                  "Wrist Curl": "Forearms",
                  "Reverse Wrist Curl": "Forearms",
                  "Farmer's Walk": "Forearms",
                  "Plate Pinch": "Forearms",
                  "Wrist Roller": "Forearms",
                  "Grip Squeeze": "Forearms",
                  "Towel Wring": "Forearms",
                  "Finger Curl": "Forearms",
                  // Legs
                  Squat: "Legs",
                  Lunge: "Legs",
                  "Leg Press": "Legs",
                  "Leg Extension": "Legs",
                  "Leg Curl": "Legs",
                  "Calf Raise": "Legs",
                  "Bulgarian Split Squat": "Legs",
                  "Romanian Deadlift": "Legs",
                  "Hack Squat": "Legs",
                  // Shoulders
                  "Overhead Press": "Shoulders",
                  "Lateral Raise": "Shoulders",
                  "Front Raise": "Shoulders",
                  "Rear Delt Fly": "Shoulders",
                  "Arnold Press": "Shoulders",
                  "Upright Row": "Shoulders",
                  "Face Pull": "Shoulders",
                  Shrug: "Shoulders",
                  "Pike Push-up": "Shoulders",
                  "Cable Lateral Raise": "Shoulders",
                  // Triceps
                  "Close-Grip Bench Press": "Triceps",
                  "Tricep Dip": "Triceps",
                  "Overhead Extension": "Triceps",
                  "Tricep Pushdown": "Triceps",
                  "Skull Crusher": "Triceps",
                  "Diamond Push-up": "Triceps",
                  "Tricep Kickback": "Triceps",
                  "Overhead Cable Extension": "Triceps",
                  "Bench Dip": "Triceps",
                  "Tricep Rope Pushdown": "Triceps",
                };
                */
              }}
              activeOpacity={0.7}
            >
              {/* Exercise Card Container */}
              <View className="bg-gray-800 rounded-lg p-4">
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
                      <Ionicons
                        name={set.comment ? "chatbubble" : "chatbubble-outline"}
                        size={18}
                        color={set.comment ? "#17e1c5" : "#6b7280"}
                      />
                      {set.isPersonalRecord && (
                        <Ionicons name="trophy" size={18} color="#17e1c5" />
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
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default AddWorkout;
