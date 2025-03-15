// import { useEffect, useState } from "react";
// import { View, Modal, TouchableOpacity, FlatList, Alert, ActivityIndicator } from "react-native";
// import { Text } from "@/components/ui/text";
// import { Icon, CloseIcon } from "@/components/ui/icon";
// import axiosInstance from "@/config/axios";
// import { useAuthStore } from "@/store/auth/useAuthStore";

// interface AddressesModalProps {
//   visible: boolean;
//   onClose: () => void;
// }

// export default function AddressesModal({ visible, onClose }: AddressesModalProps) {
//   interface Address {
//     id: number;
//     street: string;
//     city: string;
//     state: string;
//     zip_code: string;
//     country: string;
//     is_default: boolean;
//   }

//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { token } = useAuthStore();

//   useEffect(() => {
//     if (visible) {
//       fetchAddresses();
//     }
//   }, [visible]);

//   const fetchAddresses = async () => {
//     try {
//       const response = await axiosInstance.get("/addresses", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAddresses(response.data); // Assuming response.data is an array of addresses
//     } catch (error) {
//       Alert.alert("Error", "Failed to fetch addresses.");
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal visible={visible} animationType="slide" transparent={true}>
//       <View className="flex-1 bg-white p-6">
//         {/* Close Button */}
//         <TouchableOpacity onPress={onClose} className="self-end mb-4">
//           <Icon as={CloseIcon} size="xl" className="text-gray-500" />
//         </TouchableOpacity>

//         <Text className="text-2xl font-semibold text-gray-900 mb-4">Your Addresses</Text>

//         {loading ? (
//           <ActivityIndicator size="large" color="#0000ff" />
//         ) : addresses.length === 0 ? (
//           <Text className="text-gray-500 text-center">No addresses found.</Text>
//         ) : (
//             <FlatList
//             data={addresses}
//             keyExtractor={(item) => item.id.toString()} // Ensure unique key
//             renderItem={({ item }) => (
//               <View className="p-4 bg-gray-100 rounded-lg mb-2">
//                 <Text className="text-gray-800 font-semibold">{item.street}, {item.city}</Text>
//                 <Text className="text-gray-600">{item.state}, {item.zip_code}, {item.country}</Text>
//                 {item.is_default && <Text className="text-green-600 font-bold">Default Address</Text>}
//               </View>
//             )}
//           />
//         )}
//       </View>
//     </Modal>
//   );
// }

import { useEffect, useState } from "react";
import { View, Modal, TouchableOpacity, FlatList, Alert, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/text";
import { Icon, CloseIcon, TrashIcon } from "@/components/ui/icon";
import axiosInstance from "@/config/axios";
import { useAuthStore } from "@/store/auth/useAuthStore";

interface AddressesModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddressesModal({ visible, onClose }: AddressesModalProps) {
  interface Address {
    id: number;
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    is_default: boolean;
  }

  const [addresses, setAddresses] = useState<Address[]>([]);
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

  const deleteAddress = async (id: number) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axiosInstance.delete(`/addresses/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              setAddresses((prev) => prev.filter((address) => address.id !== id));
              Alert.alert("Success", "Address deleted successfully.");
            } catch (error) {
              Alert.alert("Error", "Failed to delete address.");
              console.log(error);
            }
          },
        },
      ]
    );
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
            keyExtractor={(item) => item.id.toString()} // Ensure unique key
            renderItem={({ item }) => (
              <View className="p-4 bg-gray-100 rounded-lg mb-2 flex-row justify-between items-center">
                <View>
                  <Text className="text-gray-800 font-semibold">
                    {item.street}, {item.city}
                  </Text>
                  <Text className="text-gray-600">
                    {item.state}, {item.zip_code}, {item.country}
                  </Text>
                  {item.is_default && <Text className="text-green-600 font-bold">Default Address</Text>}
                </View>
                <TouchableOpacity onPress={() => deleteAddress(item.id)} className="p-2">
                  <Icon as={TrashIcon} size="lg" className="text-red-500" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </Modal>
  );
}

