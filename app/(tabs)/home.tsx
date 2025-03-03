import { VStack} from "@/components/ui/vstack";
import {  Text } from "@/components/ui/text";

export default function HomeScreen() {
    return (
        <VStack className="p-10">
            <Text className="text-2xl font-bold">Home</Text>
            <Text>Welcome to the home screen!</Text>
        </VStack>
    );
}
