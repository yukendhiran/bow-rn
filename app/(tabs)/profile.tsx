import { VStack} from "@/components/ui/vstack";
import {  Text } from "@/components/ui/text";

export default function ProfileScreen() {
    return (
        <VStack className="p-10">
            <Text className="text-2xl font-bold">Profile</Text>
            <Text>Manage your profile here.</Text>
        </VStack>
    );
}
