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

interface MuscleGroupsProps {
  onBack: () => void;
  onHome: () => void;
  onMuscleGroupSelect: (muscleGroup: string) => void;
}

const MuscleGroups: React.FC<MuscleGroupsProps> = ({
  onBack,
  onHome,
  onMuscleGroupSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const exerciseCategories = [
    "Abs",
    "Back",
    "Biceps",
    "Cardio",
    "Chest",
    "Forearms",
    "Legs",
    "Shoulders",
    "Triceps",
  ];

  const filteredCategories = exerciseCategories.filter((category) =>
    category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* AddWorkout Header */}
      <View className="px-4 pt-14 pb-4 border-b border-gray-800">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="chevron-back" size={24} color="#17e1c5" />
          </TouchableOpacity>
          <View className="flex-row items-center gap-4 mt-2">
            <TouchableOpacity>
              <Ionicons name="calendar" size={24} color="#17e1c5" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="add" size={24} color="#17e1c5" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={24} color="#17e1c5" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* All Exercises Title */}
      <View className="px-4 py-2 mt-2">
        <Text
          className="text-white text-2xl"
          style={{ fontFamily: "Outfit-Bold" }}
        >
          All Exercises
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-4 py-4">
        <View className="flex-row items-center bg-gray-800 rounded-lg px-3 py-3">
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

      {/* Exercise Categories List */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4">
          {filteredCategories.map((category, index) => (
            <TouchableOpacity
              key={category}
              className="flex-row items-center justify-between py-4 border-b border-gray-800"
              activeOpacity={0.7}
              onPress={() => {
                console.log(`Selected category: ${category}`);
                onMuscleGroupSelect(category);
              }}
            >
              <Text
                className="text-white text-base"
                style={{ fontFamily: "Outfit-Medium" }}
              >
                {category}
              </Text>
              <Ionicons name="ellipsis-vertical" size={20} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MuscleGroups;
