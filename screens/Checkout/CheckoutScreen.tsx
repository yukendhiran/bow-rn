import { View, Text, Button, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useCartStore } from "@/store/auth/useCartStore"; // Assuming you store cart items in Zustand

export default function Checkout() {
  const router = useRouter();
  const { cart } = useCartStore(); // Fetch cart items

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold text-center mb-4">Checkout</Text>

      {/* Cart Summary */}
      <ScrollView className="flex-1">
        {cart.map((item) => (
          <View key={item.id} className="border-b py-2">
            <Text className="text-lg font-medium">{item.name} x {item.quantity}</Text>
            <Text className="text-gray-600">₹{item.price} each</Text>
          </View>
        ))}
      </ScrollView>

      {/* Total and Buttons */}
      <View className="mt-4">
        <Text className="text-lg font-bold">Total: ₹{totalPrice.toFixed(2)}</Text>
        <Button title="Place Order" onPress={() => alert("Order Placed!")} />
        <Button title="Back to Cart" onPress={() => router.back()} color="gray" />
      </View>
    </View>
  );
}
