
import { View, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { Icon, AddIcon, RemoveIcon } from "@/components/ui/icon";
import { useEffect, useState } from "react";
import axiosInstance from "@/config/axios";
import { useCartStore } from "@/store/auth/useCartStore";

export default function FoodList() {
  interface FoodItem {
    id: number;
    name: string;
    description: string;
    price: number;
    full_image_url: string;
    category_id: number;
    category_name: string;
  }

  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { cart, addToCart, increaseQuantity, decreaseQuantity } = useCartStore();

  useEffect(() => {
    axiosInstance.get("/food-items")
      .then((response) => {
        setFoods(response.data);
        setFilteredFoods(response.data);
        
        // Extract unique categories
        const uniqueCategories: { id: number; name: string }[] = Array.from(
            new Map(
              response.data.map((item: FoodItem) => [item.category_id, item.category_name])
            ).entries()
          ).map(([id, name]) => ({ id: id as number, name: name as string }));

        setCategories(uniqueCategories);
      })
      .catch((error) => console.error("Error fetching food items:", error));
  }, []);

  // Filter food based on selected category
  const filterByCategory = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    if (categoryId === null) {
      setFilteredFoods(foods);
    } else {
      setFilteredFoods(foods.filter((item) => item.category_id === categoryId));
    }
  };

  return (
    <View className="p-4">
      {/* Category Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <TouchableOpacity onPress={() => filterByCategory(null)} className={`px-4 py-2 rounded-lg mx-1 ${selectedCategory === null ? 'bg-blue-500' : 'bg-gray-300'}`}>
          <Text className={`text-sm font-bold ${selectedCategory === null ? 'text-white' : 'text-black'}`}>All</Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => filterByCategory(category.id)}
            className={`px-4 py-2 rounded-lg mx-1 ${selectedCategory === category.id ? 'bg-blue-500' : 'bg-gray-300'}`}
          >
            <Text className={`text-sm font-bold ${selectedCategory === category.id ? 'text-white' : 'text-black'}`}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Food List */}
      <FlatList
        data={filteredFoods}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const cartItem = cart.find((cartItem) => cartItem.id === item.id);

          return (
            <Card className="flex-row items-center p-4 rounded-lg mb-2">
              <Image
                source={{ uri: item.full_image_url }}
                className="h-16 w-16 rounded-md mr-3"
                alt={item.name}
              />
              <View className="flex-1">
                <Heading size="sm">{item.name}</Heading>
                <Text className="text-sm text-gray-500">₹{item.price}</Text>
              </View>
              <HStack className="items-center">
                {cartItem ? (
                  <>
                    <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
                      <Icon as={RemoveIcon} size="md" className="text-red-500" />
                    </TouchableOpacity>
                    <Text className="mx-2">{cartItem.quantity}</Text>
                    <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
                      <Icon as={AddIcon} size="md" className="text-green-500" />
                    </TouchableOpacity>
                  </>
                ) : (
                    <TouchableOpacity
                    onPress={() =>
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.full_image_url, // Fix: Map full_image_url to image
                      })
                    }
                  >
                    <Icon as={AddIcon} size="lg" className="text-blue-500" />
                  </TouchableOpacity>
                  
                )}
              </HStack>
            </Card>
          );
        }}
      />
    </View>
  );
}


