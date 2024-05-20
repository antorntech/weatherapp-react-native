import { Text, TouchableOpacity } from "react-native";
import React from "react";

const CustomButton = ({ title, handlePress, containStyles }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`w-full min-h-[40px] bg-orange-500 rounded-md items-center justify-center ${containStyles}`}
    >
      <Text className={`text-white font-psemibold=`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
