import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { useAuthStore } from "@/store/auth/useAuthStore";
import Home from "@/screens/Home/HomeScreen";

export default function HomeScreen() {
    const { token } = useAuthStore();
    return (


        <Home />

    );
}
