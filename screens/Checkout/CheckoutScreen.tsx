import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useCartStore } from "@/store/auth/useCartStore";
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react-native";
import { useEffect } from "react";
import AddressSelector from "@/screens/Home/AddressSelector";
import { useRouter } from "expo-router";

const CartScreen = () => {
  const { cart, fetchCart, increaseQuantity, decreaseQuantity, removeFromCart } = useCartStore();
  const router = useRouter();
  useEffect(() => {
    console.log("Cart Data in Checkout:", cart);
    if (cart.length === 0) {
      fetchCart();
    } // Fetch cart data when page loads
  }, []);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-xl font-bold text-center mb-4">Your Cart</Text>

      {/* Address Selector Component */}
      <AddressSelector />

      {/* Divider */}
      <View className="border-t border-gray-300 my-3"></View>

      {/* Cart Items */}
      {cart.length === 0 ? (
        <Text className="text-center text-gray-500">Your cart is empty.</Text>
      ) : (
        <ScrollView className="space-y-4">
          {cart.map((item:
            {
              id: number;
              name: string;
              price: number;
              image: string;
              quantity: number;
            }
          ) => (
            <View key={item.id} className="bg-white p-4 rounded-xl shadow-md flex-row items-center">
              <Image source={{ uri: item.image }} className="w-16 h-16 rounded-lg" />
              <View className="flex-1 ml-4">
                <Text className="font-semibold">{item.name}</Text>
                <Text className="text-gray-600">
                ₹{item.price}
                </Text>
              </View>

              <View className="flex-row items-center space-x-3">
                <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
                  {item.quantity === 1 ? (
                    <Trash2 size={24} color="red" />
                  ) : (
                    <MinusCircle size={24} color="black" />
                  )}
                </TouchableOpacity>

                <Text className="font-bold text-lg">{item.quantity}</Text>

                <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
                  <PlusCircle size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Checkout Section */}
      {cart.length > 0 && (
        <View className="mt-6">
          <Text className="text-lg font-semibold text-right">Total: ₹{getTotalPrice().toFixed(2)}</Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="mt-4 bg-gray-300 py-3 rounded-lg"
            >
              <Text className="text-black text-center font-semibold">Back to Cart</Text>
            </TouchableOpacity>
          <TouchableOpacity
            onPress={() => alert("Proceeding to checkout...")}
            className="mt-4 bg-black py-3 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CartScreen;
