import { useState, useEffect, useRef } from "react";
import { OtpInput,OtpInputRef } from "react-native-otp-entry";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { useAuthStore } from "@/store/auth/useAuthStore";
import axiosInstance from "@/config/axios";
import { useRouter } from "expo-router";

export default function OtpScreen() {
    const { phoneNumber, login } = useAuthStore();
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const otpRef = useRef<OtpInputRef>(null);

    // Timer countdown logic
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    // Handle OTP resend
    const handleResendOtp = async () => {
        setTimer(1);
        setCanResend(false);

        try {
            const response = await axiosInstance.post("/send-otp", { phone_number: phoneNumber });
            if (response.status === 200) { 
                alert("OTP resent successfully!");
                setOtp(""); // Reset state
                setTimeout(() => otpRef.current?.clear(), 0);
            } else {
                alert("Failed to resend OTP.");
            }
        } catch (error) {
            console.error("Error resending OTP:", error);
            alert("Something went wrong. Try again later.");
        }
    };

    const handleVerifyOtp = async (enteredOtp = otp) => {
    
        if (enteredOtp.length !== 6) return; // Ensure valid OTP length
    
        setLoading(true);
    
        // try {
        //     const response = await axiosInstance.post("/verify-otp", {
        //         phone_number: phoneNumber,
        //         otp_code: enteredOtp, // Use the passed OTP instead of state
        //     });
        //     console.log(response.data);
    
        //     if (response.status === 200) {
        //         alert("OTP verified successfully!");
        //         router.replace("/(tabs)/home");
        //     } else {
        //         alert("Invalid OTP. Please try again.");
        //     }
        // } finally {
        //     setLoading(false);
        // }

        try {
            const response = await axiosInstance.post("/verify-otp", {
                phone_number: phoneNumber,
                otp_code: enteredOtp,
            });
    
            if (response.status === 200) {
                const { token, user } = response.data;
                await login(token, user);
                alert("OTP verified successfully!");
                router.replace("/(tabs)/home"); // Redirect to home
            } else {
                alert("Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            alert("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChangeNumber = () => {
        router.back();
    }

    return (
        <VStack className="px-10 mt-28 items-center" space="lg">
            <Center>
                <VStack space="sm" className="max-w-[235px] items-center mb-8">
                    <Heading size="3xl">OTP Verification</Heading>
                    
                    <Text className="text-wrap text-lg text-typography-500 text-center">
                        Type the OTP code we've sent to 
                    </Text>
                    <HStack className="items-center">
                    <Text>+91 {phoneNumber} </Text>
                    <Button variant="link" action="positive" onPress={handleChangeNumber}>
                        <ButtonText>  Change</ButtonText>
                    </Button>
                </HStack>
                </VStack>
            </Center>

            <OtpInput
                ref={otpRef}
                numberOfDigits={6}
                focusColor="black"
                autoFocus={true}
                blurOnFilled={true}
                disabled={false}
                onTextChange={(text) => setOtp(text)}
                onFilled={(enteredOtp) => {
                    handleVerifyOtp(enteredOtp); // Pass OTP directly
                }}
                textInputProps={{
                    accessibilityLabel: "One-Time Password",
                }}
            />

            {!canResend ? (
                <HStack className="items-center">
                    <Text>Resend code in </Text>
                    <Button variant="link" action="positive" isDisabled={true}>
                        <ButtonText>00:{timer < 10 ? `0${timer}` : timer}</ButtonText>
                    </Button>
                </HStack>
            ) : (
                <Button variant="link" action="positive" onPress={handleResendOtp}>
                    <ButtonText>Resend OTP</ButtonText>
                </Button>
            )}

            <Button
                className="rounded-full my-8 h-16 w-full"
                size="xl"
                variant="solid"
                action="primary"
                isDisabled={otp.length !== 6}
                onPress={() => handleVerifyOtp(otp)}
            >
                <ButtonText className="text-typography-0 text-2xl">{loading ? "Verifying..." : "Verify"}</ButtonText>
            </Button>
        </VStack>
    );
}
