import { useEffect, useState } from "react";
import { View, Modal, TouchableOpacity, FlatList, Alert, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/text";
import { Icon, CloseIcon } from "@/components/ui/icon";
import axiosInstance from "@/config/axios";
import { useAuthStore } from "@/store/auth/useAuthStore";

interface AddressesModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddressesModal({ visible, onClose }: AddressesModalProps) {
  const [addresses, setAddresses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    if (visible) {
      fetchAddresses();
    }
  }, [visible]);

  const fetchAddresses = async () => {
    try {
      const response = await axiosInstance.get("/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(response.data); // Assuming response.data is an array of addresses
    } catch (error) {
      Alert.alert("Error", "Failed to fetch addresses.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className="flex-1 bg-white p-6">
        {/* Close Button */}
        <TouchableOpacity onPress={onClose} className="self-end mb-4">
          <Icon as={CloseIcon} size="xl" className="text-gray-500" />
        </TouchableOpacity>

        <Text className="text-2xl font-semibold text-gray-900 mb-4">Your Addresses</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : addresses.length === 0 ? (
          <Text className="text-gray-500 text-center">No addresses found.</Text>
        ) : (
          <FlatList
            data={addresses}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View className="p-4 bg-gray-100 rounded-lg mb-2">
                <Text className="text-gray-800">{item}</Text>
              </View>
            )}
          />
        )}
      </View>
    </Modal>
  );
}
