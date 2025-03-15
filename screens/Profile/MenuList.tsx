import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";

interface MenuItem {
  icon: any;
  label: string;
  action?: () => void;
}

interface MenuListProps {
  menuItems: MenuItem[];
  onLogout: () => void;
}

export function MenuList({ menuItems, onLogout }: MenuListProps) {
  return (
    <View className="bg-white rounded-xl shadow-md">
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={item.action || (() => {})}
          className="flex-row items-center py-4 px-6 border-b border-gray-200"
        >
          <Icon as={item.icon} size="xl" className="text-gray-600 mr-4" />
          <Text className="flex-1 text-lg text-gray-800">{item.label}</Text>
        </TouchableOpacity>
      ))}

      {/* Logout Button */}
      <TouchableOpacity
        onPress={onLogout}
        className="flex-row items-center py-4 px-6 bg-red-100 rounded-b-xl"
      >
        <Icon size="xl" className="text-red-600 mr-4" />
        <Text className="flex-1 text-lg text-red-600 font-semibold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
