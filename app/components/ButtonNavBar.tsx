import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface NavItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
}

interface ButtonNavBarProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

const navItems: NavItem[] = [
  {
    id: "home",
    icon: "home-outline",
    activeIcon: "home",
  },
  {
    id: "log",
    icon: "add-circle-outline",
    activeIcon: "add-circle",
  },
  {
    id: "avatar",
    icon: "person-outline",
    activeIcon: "person",
  },
  {
    id: "community",
    icon: "people-outline",
    activeIcon: "people",
  },
  {
    id: "profile",
    icon: "settings-outline",
    activeIcon: "settings",
  },
];

const ButtonNavBar: React.FC<ButtonNavBarProps> = ({
  activeTab,
  onTabPress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-gray-900 border-t border-gray-800 px-2 py-2"
      style={{ paddingBottom: insets.bottom }}
    >
      <View className="flex-row items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              className="items-center py-2 px-3 rounded-lg"
              onPress={() => {
                console.log(`ButtonNavBar: ${item.id} pressed`);
                onTabPress(item.id);
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isActive ? item.activeIcon : item.icon}
                size={24}
                color={isActive ? "#17e1c5" : "#9ca3af"}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default ButtonNavBar;
