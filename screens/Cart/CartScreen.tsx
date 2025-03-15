import { View, FlatList, TouchableOpacity } from "react-native";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { Icon, AddIcon, RemoveIcon, TrashIcon } from "@/components/ui/icon";
import { useCartStore } from "@/store/auth/useCartStore";

export default function CartScreen() {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCartStore();

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View className="p-4">
      <Heading size="lg" className="mb-4">Your Cart</Heading>

      {cart.length === 0 ? (
        <Text className="text-center text-lg text-gray-500">Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card className="flex-row items-center p-4 rounded-lg mb-2">
              <Image
                source={{ uri: item.image }}
                className="h-16 w-16 rounded-md mr-3"
                alt={item.name}
              />
              <View className="flex-1">
                <Heading size="sm">{item.name}</Heading>
                <Text className="text-sm text-gray-500">₹{item.price}</Text>
              </View>
              <HStack className="items-center">
                <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
                  <Icon as={RemoveIcon} size="md" className="text-red-500" />
                </TouchableOpacity>
                <Text className="mx-2">{item.quantity}</Text>
                <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
                  <Icon as={AddIcon} size="md" className="text-green-500" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Icon as={TrashIcon} size="md" className="text-gray-500 ml-2" />
                </TouchableOpacity>
              </HStack>
            </Card>
          )}
        />
      )}

      {/* Total Price & Checkout Button */}
      {cart.length > 0 && (
        <View className="mt-4 p-4 bg-white shadow rounded-lg">
          <HStack className="justify-between">
            <Text className="text-lg font-semibold">Total:</Text>
            <Text className="text-lg font-semibold text-info-600">₹{totalPrice.toFixed(2)}</Text>
          </HStack>
          <TouchableOpacity className="bg-blue-600 p-3 mt-4 rounded-lg">
            <Text className="text-white text-center font-semibold">Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
