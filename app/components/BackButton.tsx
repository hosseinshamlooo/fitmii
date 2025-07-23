import React from "react";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function BackButton({
  style = {},
  iconColor = "black",
  iconSize = 24,
}) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={[{ position: "absolute", left: 24, top: 45, zIndex: 10 }, style]}
      onPress={() => navigation.goBack()}
      hitSlop={16}
    >
      <Ionicons name="chevron-back" size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
}
