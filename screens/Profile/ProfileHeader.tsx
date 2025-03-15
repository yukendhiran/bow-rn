import { View } from "react-native";
import { Text } from "@/components/ui/text";

interface ProfileHeaderProps {
  name?: string;
  email?: string;
}

export function ProfileHeader({ name, email }: ProfileHeaderProps) {
  return (
    <View className="bg-white p-6 rounded-xl shadow-md mb-4">
      <Text className="text-xl font-semibold text-gray-900">{name}</Text>
      <Text className="text-gray-500">{email}</Text>
    </View>
  );
}
