import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ExerciseTracker from "./ExerciseTracker";

interface AllExercisesProps {
  onBack: (
    savedSets?: Array<{
      weight: number;
      reps: number;
      setNumber: number;
      date: string;
      comment?: string;
      isPersonalRecord?: boolean;
    }>,
    exerciseName?: string
  ) => void;
  onHome: () => void;
  muscleGroup: string;
}

const AllExercises: React.FC<AllExercisesProps> = ({
  onBack,
  onHome,
  muscleGroup,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  // Exercise data for each muscle group
  const exerciseData: { [key: string]: string[] } = {
    Abs: [
      "Ab-Wheel Rollout",
      "Cable Crunch",
      "Crunch",
      "Crunch Machine",
      "Decline Crunch",
      "Dragon Flag",
      "Elbow Support Leg Raise",
      "Hanging Knee Raise",
      "Hanging Leg Raise",
      "Plank",
      "Plate Crunch Machine",
      "Russian Twist w Medicine Ball",
      "Side Plank",
    ],
    Back: [
      "Barbell Row",
      "Cable Row",
      "Deadlift",
      "Lat Pulldown",
      "Pull-up",
      "Seated Cable Row",
      "T-Bar Row",
      "Wide-Grip Pull-up",
      "Bent-Over Row",
      "One-Arm Dumbbell Row",
    ],
    Biceps: [
      "Barbell Curl",
      "Dumbbell Curl",
      "Hammer Curl",
      "Cable Curl",
      "Preacher Curl",
      "Concentration Curl",
      "Incline Dumbbell Curl",
      "21s",
      "Spider Curl",
      "Reverse Curl",
    ],
    Cardio: [
      "Running",
      "Cycling",
      "Swimming",
      "Rowing",
      "Elliptical",
      "Jump Rope",
      "Burpees",
      "Mountain Climbers",
      "High Knees",
      "Jumping Jacks",
    ],
    Chest: [
      "Bench Press",
      "Incline Bench Press",
      "Decline Bench Press",
      "Dumbbell Press",
      "Push-up",
      "Cable Fly",
      "Dumbbell Fly",
      "Dips",
      "Pec Deck",
      "Incline Dumbbell Fly",
    ],
    Forearms: [
      "Wrist Curl",
      "Reverse Wrist Curl",
      "Farmer's Walk",
      "Plate Pinch",
      "Hammer Curl",
      "Reverse Curl",
      "Wrist Roller",
      "Grip Squeeze",
      "Towel Wring",
      "Finger Curl",
    ],
    Legs: [
      "Squat",
      "Deadlift",
      "Lunge",
      "Leg Press",
      "Leg Extension",
      "Leg Curl",
      "Calf Raise",
      "Bulgarian Split Squat",
      "Romanian Deadlift",
      "Hack Squat",
    ],
    Shoulders: [
      "Overhead Press",
      "Lateral Raise",
      "Front Raise",
      "Rear Delt Fly",
      "Arnold Press",
      "Upright Row",
      "Face Pull",
      "Shrug",
      "Pike Push-up",
      "Cable Lateral Raise",
    ],
    Triceps: [
      "Close-Grip Bench Press",
      "Tricep Dip",
      "Overhead Extension",
      "Tricep Pushdown",
      "Skull Crusher",
      "Diamond Push-up",
      "Tricep Kickback",
      "Overhead Cable Extension",
      "Bench Dip",
      "Tricep Rope Pushdown",
    ],
  };

  const exercises = exerciseData[muscleGroup] || [];
  const filteredExercises = exercises.filter((exercise) =>
    exercise.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If an exercise is selected, show the ExerciseTracker
  if (selectedExercise) {
    return (
      <ExerciseTracker
        onBack={(savedSets) => {
          console.log("AllExercises received from ExerciseTracker:", {
            savedSets,
            selectedExercise,
          });
          setSelectedExercise(null);
          if (savedSets && savedSets.length > 0) {
            console.log("AllExercises passing to AddWorkout:", {
              savedSets,
              selectedExercise,
            });
            onBack(savedSets, selectedExercise);
          } else {
            onBack();
          }
        }}
        onHome={onHome}
        exerciseName={selectedExercise}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View>
        <View className="bg-gray-800 rounded-2xl p-6 pt-16">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => onBack()} className="mr-3">
                <Ionicons name="chevron-back" size={22} color="#17e1c5" />
              </TouchableOpacity>
              <Text
                className="text-white text-xl flex-1"
                style={{ fontFamily: "Outfit-Bold" }}
                numberOfLines={1}
              >
                All Exercises
              </Text>
            </View>
            <View className="flex-row items-center gap-4 ml-[-200]">
              <TouchableOpacity>
                <Ionicons name="calendar" size={20} color="#17e1c5" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="add" size={20} color="#17e1c5" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="ellipsis-vertical" size={20} color="#17e1c5" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View className="bg-gray-700 rounded-3xl">
            <View className="flex-row items-center px-4 py-1">
              <Ionicons name="search" size={20} color="#9ca3af" />
              <TextInput
                className="flex-1 text-white ml-3"
                placeholder="Search exercises..."
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{ fontFamily: "Outfit-Regular" }}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Exercise List */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4">
          {filteredExercises.map((exercise, index) => (
            <TouchableOpacity
              key={exercise}
              className="flex-row items-center justify-between py-4 border-b border-gray-800"
              activeOpacity={0.7}
              onPress={() => {
                console.log(`Selected exercise: ${exercise}`);
                setSelectedExercise(exercise);
              }}
            >
              <Text
                className="text-white text-base"
                style={{ fontFamily: "Outfit-Medium" }}
              >
                {exercise}
              </Text>
              <Ionicons name="ellipsis-vertical" size={20} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllExercises;
