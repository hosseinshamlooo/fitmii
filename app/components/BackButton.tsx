import React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function BackButton({
  style = {},
  iconColor = "#17e1c5",
  iconSize = 24,
}) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={[{ position: "absolute", left: 24, top: 47, zIndex: 10 }, style]}
      onPress={() => navigation.goBack()}
      hitSlop={16}
    >
      <Ionicons name="chevron-back" size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
}
