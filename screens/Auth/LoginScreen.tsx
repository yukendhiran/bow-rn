import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Divider } from '@/components/ui/divider';
import React from "react";
import { useRouter, Link } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useAuthStore } from "@/store/auth/useAuthStore";
import axiosInstance from "@/config/axios";


export default function LoginScreen() {

    const router = useRouter();
    const { phoneNumber, setPhoneNumber } = useAuthStore();

    const handleLogin = async () => {

        if (!phoneNumber || phoneNumber.length !== 10) {
            alert("Please enter a valid 10-digit mobile number.");
            return;
        }

        try {
            const response = await axiosInstance.post("/send-otp", { phone_number: phoneNumber });

            if (response.status === 200) {
                //alert("OTP sent successfully!");
                router.push("/otp"); // Navigate to OTP verification screen
            } else {
                alert("Failed to send OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            alert("Something went wrong. Please try again later.");
        }
    };
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <FormControl className="px-10 mt-28  flex-1 justify-between">
                    <VStack space="lg">
                        <Heading className="text-typography-900 text-3xl font-bold">Welcome Back!</Heading>
                        <Text className="text-typography-500 text-lg">
                            Enter your mobile number to continue. We will send an OTP for verification.
                        </Text>
                        <Text className="text-typography-500 text-xl mt-2">Mobile Number</Text>

                        <Input variant="outline" size="xl" className="h-20 rounded-xl">
                            <Text className="text-2xl font-semibold text-gray-600 ml-4">+91</Text>
                            <Divider orientation="vertical" className="mx-2 h-10 bg-black border-[0.5px]" />
                            <InputField
                                type="text"
                                placeholder="Enter your mobile number"
                                keyboardType="numeric"
                                returnKeyType="go"
                                className="text-2xl"
                                maxLength={10}
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                            />
                        </Input>
                    </VStack>

                    <Button className="rounded-full w-full mb-8 h-16" size="xl" variant="solid" action="primary" onPress={handleLogin}>
                        <ButtonText className="text-typography-0 text-2xl">Send OTP</ButtonText>
                    </Button>
                </FormControl>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}