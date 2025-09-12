import React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

interface BackButtonProps {
  style?: any;
  iconColor?: string;
  iconSize?: number;
  onPress?: () => void;
}

export default function BackButton({
  style = {},
  iconColor = "#17e1c5",
  iconSize = 24,
  onPress,
}: BackButtonProps) {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity
      style={[{ position: "absolute", left: 24, top: 47, zIndex: 10 }, style]}
      onPress={handlePress}
      hitSlop={16}
    >
      <Ionicons name="chevron-back" size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
}
