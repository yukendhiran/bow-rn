import { VStack} from "@/components/ui/vstack";
import {  Text } from "@/components/ui/text";

export default function CartScreen() {
    return (
        <VStack className="p-10">
            <Text className="text-2xl font-bold">Cart</Text>
            <Text>Your cart is empty.</Text>
        </VStack>
    );
}
