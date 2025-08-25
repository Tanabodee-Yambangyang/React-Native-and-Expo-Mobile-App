import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';

type AlertType = "info" | "success" | "warning" | "error";

interface AlertBoxPropsInterface {
  message: string;
  type?: AlertType;
  setter: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AlertBox({ message, type = 'info', setter }: AlertBoxPropsInterface) {
  const typeStyles = {
    info: 'bg-blue-100 border-blue-400 text-blue-800',
    success: 'bg-green-100 border-green-400 text-green-800',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-800',
    error: 'bg-red-100 border-red-400 text-red-800',
  };

  const iconColor = {
    info: '#3b82f6',
    success: '#10b981',
    warning: '#facc15',
    error: '#ef4444',
  }[type];

  const iconName = {
    info: 'information-circle',
    success: 'checkmark-circle',
    warning: 'alert-circle',
    error: 'alert-circle',
  }[type];

  return (
    <View className="absolute top-0 w-full p-4 z-50">
      <View className={`flex flex-row items-center justify-between border-l-4 px-4 py-2 rounded-md ${typeStyles[type]}`}>
        <View className="flex flex-row items-center gap-2">
          <Ionicons name={iconName as any} size={24} color={iconColor} />
          <Text className="text-xs font-medium">{message}</Text>
        </View>
        <Feather
          name="x"
          size={18}
          color="gray"
          onPress={() => setter(prev => !prev)}
          accessibilityRole="button"
          accessibilityLabel="Close alert"
        />
      </View>
    </View>
  );
}
