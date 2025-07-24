import React from "react";
import { TouchableOpacity, Text, GestureResponderEvent } from "react-native";
import { Link } from "expo-router";

interface ButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  children: React.ReactNode;
  href?: string;
  className?: string;
}

export default function Button({
  onPress,
  disabled,
  children,
  href,
  className = "",
}: ButtonProps) {
  const baseClass = `py-4 rounded-full ${disabled ? "bg-accent/15" : "bg-accent"} ${className}`;
  const textClass = "text-center text-lg text-white";
  const textStyle = { fontFamily: "Outfit-Bold" };

  if (href) {
    return (
      <Link href={href} className={baseClass} style={textStyle}>
        <Text className={textClass} style={textStyle}>
          {children}
        </Text>
      </Link>
    );
  }

  return (
    <TouchableOpacity
      className={baseClass}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={disabled ? 1 : 0.8}
    >
      <Text className={textClass} style={textStyle}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}
