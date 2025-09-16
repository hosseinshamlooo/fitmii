import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ExerciseSet {
  weight: number;
  reps: number;
  setNumber: number;
  date: string;
  comment?: string;
  isPersonalRecord?: boolean;
}

interface ExerciseHistoryProps {
  exerciseName: string;
  savedSets: ExerciseSet[];
}

const ExerciseHistory: React.FC<ExerciseHistoryProps> = ({
  exerciseName,
  savedSets,
}) => {
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedSet, setSelectedSet] = useState<ExerciseSet | null>(null);

  // Group sets by date
  const groupedSets = savedSets.reduce(
    (acc, set) => {
      try {
        // Parse the ISO date string and create a proper date key
        const dateObj = new Date(set.date);
        if (isNaN(dateObj.getTime())) {
          throw new Error("Invalid date");
        }

        // Create a consistent date key (YYYY-MM-DD format)
        const dateKey = dateObj.toISOString().split("T")[0];
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(set);
      } catch (error) {
        // Fallback for invalid dates - use current date
        const fallbackDate = new Date().toISOString().split("T")[0];
        if (!acc[fallbackDate]) {
          acc[fallbackDate] = [];
        }
        acc[fallbackDate].push(set);
      }
      return acc;
    },
    {} as Record<string, ExerciseSet[]>
  );

  const sortedDates = Object.keys(groupedSets).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const handleCommentPress = (set: ExerciseSet) => {
    setSelectedSet(set);
    setShowCommentModal(true);
  };

  const handleCloseComment = () => {
    setShowCommentModal(false);
    setSelectedSet(null);
  };

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
                <Text
                  className="text-white text-base mb-2"
                  style={{ fontFamily: "Outfit-SemiBold" }}
                >
                  {new Date(date + "T00:00:00")
                    .toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })
                    .toUpperCase()}
                </Text>

                {/* Sets for this date - no individual boxes, just list items */}
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
                          <TouchableOpacity
                            onPress={() => handleCommentPress(set)}
                          >
                            <Ionicons
                              name={
                                set.comment
                                  ? "chatbubble"
                                  : "chatbubble-outline"
                              }
                              size={20}
                              color={set.comment ? "#17e1c5" : "#6b7280"}
                            />
                          </TouchableOpacity>
                          {set.isPersonalRecord && (
                            <Ionicons name="trophy" size={20} color="#17e1c5" />
                          )}
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
                    ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

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
  );
};

export default ExerciseHistory;
