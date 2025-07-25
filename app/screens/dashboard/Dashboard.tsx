import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ButtonNavBar from "../../components/ButtonNavBar";

const { width } = Dimensions.get("window");

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    // TODO: Add navigation logic here when other screens are implemented
    console.log(`Navigating to ${tabId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="px-4 pt-2 pb-6 mt-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="relative">
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
                  }}
                  className="w-12 h-12 rounded-full"
                />
                <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-gray-900" />
              </View>
              <View className="ml-3 flex-1">
                <Text
                  className="text-accent text-lg"
                  style={{ fontFamily: "Outfit-Bold" }}
                >
                  Hello Parmis!
                </Text>
                <Text
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: "Outfit-Regular" }}
                >
                  Let's start your day
                </Text>
              </View>
            </View>
            <TouchableOpacity className="p-2">
              <Ionicons name="trophy" size={24} color="#17e1c5" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Steps Progress Card */}
        <View className="px-4 mb-4">
          <View className="bg-gray-800 rounded-2xl p-4">
            <Text
              className="text-white text-lg mb-3"
              style={{ fontFamily: "Outfit-SemiBold" }}
            >
              Steps
            </Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text
                  className="text-white text-2xl"
                  style={{ fontFamily: "Outfit-Bold" }}
                >
                  11 000
                </Text>
                <Text
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: "Outfit-Regular" }}
                >
                  / 16 000
                </Text>
              </View>
              <View className="flex-1 ml-4">
                <View className="flex-row items-center justify-between mb-1">
                  <Text
                    className="text-accent text-sm"
                    style={{ fontFamily: "Outfit-Medium" }}
                  >
                    68%
                  </Text>
                </View>
                <View className="w-full h-2 bg-gray-700 rounded-full">
                  <View
                    className="h-2 bg-accent rounded-full"
                    style={{ width: "68%" }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Daily Activity Card */}
        <View className="px-4 mb-4">
          <View className="bg-gray-800 rounded-2xl p-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text
                className="text-white text-lg"
                style={{ fontFamily: "Outfit-SemiBold" }}
              >
                Daily Activity
              </Text>
              <TouchableOpacity>
                <Text
                  className="text-accent text-sm"
                  style={{ fontFamily: "Outfit-Medium" }}
                >
                  See all
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center">
              <View className="flex-1">
                <View className="mb-3">
                  <Text
                    className="text-gray-400 text-sm mb-1"
                    style={{ fontFamily: "Outfit-Regular" }}
                  >
                    Steps
                  </Text>
                  <Text
                    className="text-white text-lg"
                    style={{ fontFamily: "Outfit-Bold" }}
                  >
                    11 000
                  </Text>
                  <Text
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: "Outfit-Regular" }}
                  >
                    / 16 000
                  </Text>
                </View>
                <View className="mb-3">
                  <Text
                    className="text-gray-400 text-sm mb-1"
                    style={{ fontFamily: "Outfit-Regular" }}
                  >
                    Calories
                  </Text>
                  <Text
                    className="text-white text-lg"
                    style={{ fontFamily: "Outfit-Bold" }}
                  >
                    440
                  </Text>
                  <Text
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: "Outfit-Regular" }}
                  >
                    / 680 Cal
                  </Text>
                </View>
                <View>
                  <Text
                    className="text-gray-400 text-sm mb-1"
                    style={{ fontFamily: "Outfit-Regular" }}
                  >
                    Water
                  </Text>
                  <Text
                    className="text-white text-lg"
                    style={{ fontFamily: "Outfit-Bold" }}
                  >
                    1,8
                  </Text>
                  <Text
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: "Outfit-Regular" }}
                  >
                    / 2,5 L
                  </Text>
                </View>
              </View>
              <View className="ml-4">
                <View className="w-20 h-20 rounded-full border-4 border-accent items-center justify-center">
                  <Text
                    className="text-accent text-lg"
                    style={{ fontFamily: "Outfit-Bold" }}
                  >
                    68%
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Workouts Card */}
        <View className="px-4 mb-6">
          <View className="bg-gray-800 rounded-2xl p-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text
                className="text-white text-lg"
                style={{ fontFamily: "Outfit-SemiBold" }}
              >
                Workouts
              </Text>
              <TouchableOpacity>
                <Text
                  className="text-accent text-sm"
                  style={{ fontFamily: "Outfit-Medium" }}
                >
                  See all
                </Text>
              </TouchableOpacity>
            </View>

            {/* Indoor Walk */}
            <View className="flex-row items-center mb-4 p-3 bg-gray-700 rounded-xl">
              <View className="w-10 h-10 bg-accent rounded-full items-center justify-center mr-3">
                <Ionicons name="walk" size={20} color="#1f2937" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-white"
                  style={{ fontFamily: "Outfit-Medium" }}
                >
                  Indoor Walk
                </Text>
                <Text
                  className="text-white text-lg"
                  style={{ fontFamily: "Outfit-Bold" }}
                >
                  2.44 km
                </Text>
              </View>
              <TouchableOpacity>
                <Text
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: "Outfit-Regular" }}
                >
                  Today {">"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Morning Running */}
            <View className="flex-row items-center p-3 bg-gray-700 rounded-xl">
              <View className="w-10 h-10 bg-accent rounded-full items-center justify-center mr-3">
                <Ionicons name="fitness" size={20} color="#1f2937" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-white"
                  style={{ fontFamily: "Outfit-Medium" }}
                >
                  Morning Running
                </Text>
                <Text
                  className="text-white text-lg"
                  style={{ fontFamily: "Outfit-Bold" }}
                >
                  3.88 km
                </Text>
              </View>
              <TouchableOpacity>
                <Text
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: "Outfit-Regular" }}
                >
                  Today {">"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Key Metrics Cards */}
        <View className="px-4 mb-4">
          <View className="flex-row space-x-3">
            <View className="flex-1 bg-gray-800 rounded-2xl p-4 items-center">
              <View className="w-10 h-10 bg-accent rounded-full items-center justify-center mb-2">
                <Ionicons name="walk" size={20} color="#1f2937" />
              </View>
              <Text
                className="text-white text-xl"
                style={{ fontFamily: "Outfit-Bold" }}
              >
                6.359
              </Text>
              <Text
                className="text-gray-400 text-xs uppercase"
                style={{ fontFamily: "Outfit-Regular" }}
              >
                Steps
              </Text>
            </View>

            <View className="flex-1 bg-gray-800 rounded-2xl p-4 items-center">
              <View className="w-10 h-10 bg-accent rounded-full items-center justify-center mb-2">
                <Ionicons name="flame" size={20} color="#1f2937" />
              </View>
              <Text
                className="text-white text-xl"
                style={{ fontFamily: "Outfit-Bold" }}
              >
                3.115
              </Text>
              <Text
                className="text-gray-400 text-xs uppercase"
                style={{ fontFamily: "Outfit-Regular" }}
              >
                Cal Burn
              </Text>
            </View>

            <View className="flex-1 bg-gray-800 rounded-2xl p-4 items-center">
              <View className="w-10 h-10 bg-accent rounded-full items-center justify-center mb-2">
                <Ionicons name="heart" size={20} color="#1f2937" />
              </View>
              <Text
                className="text-white text-xl"
                style={{ fontFamily: "Outfit-Bold" }}
              >
                123
              </Text>
              <Text
                className="text-gray-400 text-xs uppercase"
                style={{ fontFamily: "Outfit-Regular" }}
              >
                BPM
              </Text>
            </View>
          </View>
        </View>

        {/* Calories Chart */}
        <View className="px-4 mb-4">
          <View className="bg-gray-800 rounded-2xl p-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text
                className="text-white text-lg"
                style={{ fontFamily: "Outfit-SemiBold" }}
              >
                Calories
              </Text>
              <View className="items-end">
                <Text
                  className="text-gray-400 text-xs uppercase"
                  style={{ fontFamily: "Outfit-Regular" }}
                >
                  Weekly Average
                </Text>
                <Text
                  className="text-white text-lg"
                  style={{ fontFamily: "Outfit-Bold" }}
                >
                  102 Cal
                </Text>
              </View>
            </View>

            <View className="flex-row items-end justify-between h-20">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
                (day, index) => (
                  <View key={day} className="items-center">
                    <View
                      className={`w-6 rounded-t-sm ${
                        day === "TUE" ? "bg-yellow-400" : "bg-gray-600"
                      }`}
                      style={{ height: day === "TUE" ? 60 : 40 }}
                    />
                    <Text
                      className="text-gray-400 text-xs mt-2"
                      style={{ fontFamily: "Outfit-Regular" }}
                    >
                      {day}
                    </Text>
                  </View>
                )
              )}
            </View>
          </View>
        </View>

        {/* Personalized Plan */}
        <View className="px-4 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text
              className="text-white text-lg"
              style={{ fontFamily: "Outfit-SemiBold" }}
            >
              Personalized Plan
            </Text>
            <TouchableOpacity>
              <Text
                className="text-gray-400 text-xs uppercase"
                style={{ fontFamily: "Outfit-Regular" }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View className="bg-gray-800 rounded-2xl overflow-hidden">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop",
              }}
              className="w-full h-32"
              resizeMode="cover"
            />
            <View className="absolute bottom-0 left-0 p-4">
              <Text
                className="text-white text-xl"
                style={{ fontFamily: "Outfit-Bold" }}
              >
                Chest Workout
              </Text>
              <Text
                className="text-white text-sm"
                style={{ fontFamily: "Outfit-Regular" }}
              >
                5-8 min
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <ButtonNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

export default Dashboard;
