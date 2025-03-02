import { OtpInput } from "react-native-otp-entry";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";


export default function OtpScreen() {
    return (

        <>
            <VStack className="px-10 mt-28  items-center " space="lg">
                <Center >
                    <VStack space="sm" className="max-w-[235px]  items-center ">
                        <Heading size="3xl">OTP Verification</Heading>
                        <Text className="text-wrap text-lg text-typography-500  text-center">
                            Type the OTP code we've sent to your mobile number
                        </Text>
                        <Text className=" text-3xl text-green-500">00:30</Text>
                    </VStack>
                </Center>
                <OtpInput 
                numberOfDigits={6} 
                focusColor="black"
                autoFocus={true}
                blurOnFilled={true}
                disabled={false}
                onFocus={() => console.log("Focused")}
                onBlur={() => console.log("Blurred")}
                onTextChange={(text) => console.log(text)}
                onFilled={(text) => console.log(`OTP is ${text}`)}
                textInputProps={{
                  accessibilityLabel: "One-Time Password",
                }}
                />
                <Button className="rounded-full my-8 h-16 w-full " size="xl" variant="solid" action="primary">
                    <ButtonText className="text-typography-0 text-2xl">Verify</ButtonText>
                </Button>

                <HStack className="items-center">
                    <Text className="">
                        Didn't Recive the code?  </Text>
                    <Button variant="link" action="positive" className="">
                        <ButtonText>Resend code</ButtonText>
                    </Button>
                </HStack>


            </VStack>
        </>
    )
}