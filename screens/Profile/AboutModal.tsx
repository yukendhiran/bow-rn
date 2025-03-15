import { View, TouchableOpacity, Modal, Linking } from "react-native";
import { Text } from "@/components/ui/text";
import { Icon, CloseIcon} from "@/components/ui/icon";

import { Instagram,Phone  } from "lucide-react-native";

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AboutModal({ visible, onClose }: AboutModalProps) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View className="flex-1 bg-white p-6">
        {/* Close Button */}
        <TouchableOpacity onPress={onClose} className="self-end mb-4">
          <Icon as={CloseIcon} size="xl" className="text-gray-500" />
        </TouchableOpacity>

        <Text className="text-2xl font-semibold text-gray-900 mb-4">About Box of Wellness</Text>
        <Text className="text-gray-700 mb-6">
          Box of Wellness is your personalized food and nutrition companion, helping you plan meals and consult experts.
        </Text>

        {/* Instagram Link */}
        <TouchableOpacity
          onPress={() => Linking.openURL("https://www.instagram.com/box_of_wellness/")}
          className="flex-row items-center bg-gray-100 p-4 rounded-lg mb-4"
        >
          <Icon as={Instagram} size="xl" className="text-purple-600 mr-4" />
          <Text className="text-lg text-purple-600 font-semibold">Follow on Instagram</Text>
        </TouchableOpacity>

        {/* WhatsApp Link */}
        <TouchableOpacity
          onPress={() => Linking.openURL("https://wa.me/916374759268")}
          className="flex-row items-center bg-green-100 p-4 rounded-lg"
        >
          <Icon as={Phone} size="xl" className="text-green-600 mr-4" />
          <Text className="text-lg text-green-600 font-semibold">Chat on WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
