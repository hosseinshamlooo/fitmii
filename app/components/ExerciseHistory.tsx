import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ExerciseSet {
  weight: number;
  reps: number;
  setNumber: number;
  date: string;
}

interface ExerciseHistoryProps {
  exerciseName: string;
  savedSets: ExerciseSet[];
}

const ExerciseHistory: React.FC<ExerciseHistoryProps> = ({
  exerciseName,
  savedSets,
}) => {
  // Group sets by date
  const groupedSets = savedSets.reduce(
    (acc, set) => {
      const date = set.date || new Date().toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(set);
      return acc;
    },
    {} as Record<string, ExerciseSet[]>
  );

  const sortedDates = Object.keys(groupedSets).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <View className="flex-1">
      <ScrollView className="px-4 py-3">
        {savedSets.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="fitness-outline" size={48} color="#6b7280" />
            <Text
              className="text-gray-400 text-lg mt-4 text-center"
              style={{ fontFamily: "Outfit-Regular" }}
            >
              No workout history yet
            </Text>
            <Text
              className="text-gray-500 text-sm mt-2 text-center"
              style={{ fontFamily: "Outfit-Regular" }}
            >
              Start tracking your {exerciseName} workouts to see your progress
              here
            </Text>
          </View>
        ) : (
          <View>
            {sortedDates.map((date) => (
              <View key={date} className="mb-6">
                {/* Date Header */}
                <View className="flex-row items-center mb-3">
                  <Ionicons name="calendar" size={16} color="#17e1c5" />
                  <Text
                    className="text-accent text-sm ml-2"
                    style={{ fontFamily: "Outfit-SemiBold" }}
                  >
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>

                {/* Sets for this date */}
                <View className="bg-gray-800 rounded-lg p-4">
                  {groupedSets[date]
                    .sort((a, b) => a.setNumber - b.setNumber)
                    .map((set, index) => (
                      <View
                        key={index}
                        className={`flex-row items-center justify-between py-3 ${
                          index < groupedSets[date].length - 1
                            ? "border-b border-gray-700"
                            : ""
                        }`}
                      >
                        <View className="flex-row items-center gap-4">
                          <View className="flex-row items-center gap-2">
                            <Ionicons name="trophy" size={16} color="#17e1c5" />
                            <Text
                              className="text-white text-sm"
                              style={{ fontFamily: "Outfit-Bold" }}
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
                        <View className="flex-row items-center gap-2">
                          <Text
                            className="text-gray-400 text-xs"
                            style={{ fontFamily: "Outfit-Regular" }}
                          >
                            {new Date(date).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Text>
                          <TouchableOpacity>
                            <Ionicons
                              name="ellipsis-horizontal"
                              size={16}
                              color="#6b7280"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ExerciseHistory;
