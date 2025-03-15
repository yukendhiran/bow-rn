// import { useState } from "react";
// import { View, TouchableOpacity, Alert, TextInput, Modal } from "react-native";
// import { Text } from "@/components/ui/text";
// import { Icon, LockIcon, ClockIcon, GlobeIcon, SettingsIcon, InfoIcon, ArrowLeftIcon, CloseIcon } from "@/components/ui/icon";
// import { useAuthStore } from "@/store/auth/useAuthStore";
// import { useRouter } from "expo-router";
// import axiosInstance from "@/config/axios";

// export default function ProfileScreen() {
//   const { logout, token, user, setUser } = useAuthStore();
//   const router = useRouter();
//   const [modalVisible, setModalVisible] = useState(false);
//   const [name, setName] = useState(user?.name || "");
//   const [email, setEmail] = useState(user?.email || "");

//   const handleLogout = async () => {
//     try {
//       await axiosInstance.post("/logout", {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       logout(); // Clear user session
//       router.replace("/");
//     } catch (error) {
//       Alert.alert("Logout Failed", "Something went wrong. Please try again.");
//       console.log(error);
//     }
//   };

//   const handleSaveProfile = async () => {
//     try {
//       const response = await axiosInstance.post(
//         "/profile/update",
//         { name, email },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setUser({ ...user, name, email }); // Update global state
//       setModalVisible(false);
//       Alert.alert("Success", "Profile updated successfully!");
//     } catch (error) {
//       Alert.alert("Update Failed", "Could not update profile.");
//       console.log(error);
//     }
//   };

//   const menuItems = [
//     { icon: LockIcon, label: "Orders" },
//     { icon: ClockIcon, label: "History" },
//     { icon: GlobeIcon, label: "Addresses" },
//     { icon: SettingsIcon, label: "Account", action: () => setModalVisible(true) },
//     { icon: InfoIcon, label: "About" },
//   ];

//   return (
//     <View className="flex-1 bg-gray-100 p-6">
//       {/* Profile Section */}
//       <View className="bg-white p-6 rounded-xl shadow-md mb-4">
//         <Text className="text-xl font-semibold text-gray-900">{user?.name}</Text>
//         <Text className="text-gray-500">{user?.email}</Text>
        
//       </View>

//       {/* Menu Items */}
//       <View className="bg-white rounded-xl shadow-md">
//         {menuItems.map((item, index) => (
//           <TouchableOpacity
//             key={index}
//             onPress={item.action ? item.action : () => {}}
//             className="flex-row items-center py-4 px-6 border-b border-gray-200"
//           >
//             <Icon as={item.icon} size="xl" className="text-gray-600 mr-4" />
//             <Text className="flex-1 text-lg text-gray-800">{item.label}</Text>
//           </TouchableOpacity>
//         ))}

//         {/* Logout Button */}
//         <TouchableOpacity
//           onPress={handleLogout}
//           className="flex-row items-center py-4 px-6 bg-red-100 rounded-b-xl"
//         >
//           <Icon as={ArrowLeftIcon} size="xl" className="text-red-600 mr-4" />
//           <Text className="flex-1 text-lg text-red-600 font-semibold">Logout</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Full-Screen Modal for Editing Profile */}
//       <Modal visible={modalVisible} animationType="slide" presentationStyle="fullScreen">
//         <View className="flex-1 bg-white p-6">
//           {/* Close Button */}
//           <TouchableOpacity onPress={() => setModalVisible(false)} className="self-end mb-4">
//             <Icon as={CloseIcon} size="xl" className="text-gray-500" />
//           </TouchableOpacity>

//           <Text className="text-2xl font-semibold text-gray-900 mb-4">Edit Profile</Text>

//           {/* Name Input */}
//           <Text className="text-gray-700 mb-2">Name</Text>
//           <TextInput
//             value={name}
//             onChangeText={setName}
//             placeholder="Enter your name"
//             className="w-full p-3 border border-gray-300 rounded-lg mb-4"
//           />

//           {/* Email Input */}
//           <Text className="text-gray-700 mb-2">Email</Text>
//           <TextInput
//             value={email}
//             onChangeText={setEmail}
//             placeholder="Enter your email"
//             keyboardType="email-address"
//             className="w-full p-3 border border-gray-300 rounded-lg mb-6"
//           />

//           {/* Save Button */}
//           <TouchableOpacity onPress={handleSaveProfile} className="bg-blue-500 p-4 rounded-lg">
//             <Text className="text-white text-center text-lg font-semibold">Save</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     </View>
//   );
// }
import { useState } from "react";
import { View, Alert } from "react-native";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { useRouter } from "expo-router";
import axiosInstance from "@/config/axios";
import { ProfileHeader } from "./ProfileHeader";
import { MenuList } from "./MenuList";
import { EditProfileModal } from "./EditProfileModal";
import { LockIcon, ClockIcon, GlobeIcon, SettingsIcon, InfoIcon, ArrowLeftIcon } from "@/components/ui/icon";
import  AboutModal  from "./AboutModal";
import AddressesModal  from "./AddressesModal"; 

export default function ProfileScreen() {
  const { logout, token, user, setUser } = useAuthStore();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [addressesModalVisible, setAddressesModalVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/logout", {}, { headers: { Authorization: `Bearer ${token}` } });

      logout();
      router.replace("/");
    } catch (error) {
      Alert.alert("Logout Failed", "Something went wrong. Please try again.");
      console.log(error);
    }
  };

  const menuItems = [
    { icon: LockIcon, label: "Orders" },
    { icon: ClockIcon, label: "History" },
    { icon: GlobeIcon, label: "Addresses",action: () => setAddressesModalVisible(true) },
    { icon: SettingsIcon, label: "Account", action: () => setModalVisible(true) },
    { icon: InfoIcon, label: "About", action: () => setAboutModalVisible(true) },
  ];

  return (
    <View className="flex-1 bg-gray-100 p-6">
      <ProfileHeader name={user?.name ?? undefined} email={user?.email ?? undefined} />
      <MenuList menuItems={menuItems} onLogout={handleLogout} />
      {user && (
        <EditProfileModal visible={modalVisible} onClose={() => setModalVisible(false)} token={token} user={user} setUser={setUser} />
      )}
      <AboutModal visible={aboutModalVisible} onClose={() => setAboutModalVisible(false)} />
      <AddressesModal visible={addressesModalVisible} onClose={() => setAddressesModalVisible(false)}/>
    </View>
  );
}
