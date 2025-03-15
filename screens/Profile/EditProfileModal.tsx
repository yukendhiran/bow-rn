import { useState } from "react";
import { View, TextInput, TouchableOpacity, Modal, Alert } from "react-native";
import { Text } from "@/components/ui/text";
import { Icon, CloseIcon } from "@/components/ui/icon";
import axiosInstance from "@/config/axios";

interface EditProfileModalProps {
    visible: boolean;
    onClose: () => void;
    token: string | null;
    user: {
        name?: string | null;
        email?: string | null;
    } | null | undefined;
    setUser: (user: Partial<{ name: string; email: string }>) => void;
}

export function EditProfileModal({ visible, onClose, token, user, setUser }: EditProfileModalProps) {
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");

    const handleSaveProfile = async () => {
        try {
            await axiosInstance.post(
                "/profile/update",
                { name, email },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUser({ name, email });
            onClose();
            Alert.alert("Success", "Profile updated successfully!");
        } catch (error) {
            Alert.alert("Update Failed", "Could not update profile.");
            console.log(error);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
            <View className="flex-1 bg-white p-6">
                {/* Close Button */}
                <TouchableOpacity onPress={onClose} className="self-end mb-4">
                    <Icon as={CloseIcon} size="xl" className="text-gray-500" />
                </TouchableOpacity>

                <Text className="text-2xl font-semibold text-gray-900 mb-4">Edit Profile</Text>

                {/* Name Input */}
                <Text className="text-gray-700 mb-2">Name</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                />

                {/* Email Input */}
                <Text className="text-gray-700 mb-2">Email</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-6"
                />

                {/* Save Button */}
                <TouchableOpacity onPress={handleSaveProfile} className="bg-blue-500 p-4 rounded-lg">
                    <Text className="text-white text-center text-lg font-semibold">Save</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}
