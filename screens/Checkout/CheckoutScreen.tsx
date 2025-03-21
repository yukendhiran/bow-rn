import { View, Text, ScrollView, TouchableOpacity, Image, Alert, StyleSheet } from "react-native";
import { useCartStore } from "@/store/auth/useCartStore";
import { MinusCircle, PlusCircle, Trash2, CreditCard, Check } from "lucide-react-native";
import { useEffect, useState } from "react";
import AddressSelector from "@/screens/Home/AddressSelector";
import { useRouter } from "expo-router";
import { CardForm, StripeProvider, useStripe } from '@stripe/stripe-react-native';

const CheckoutScreen = () => {
  const { cart, fetchCart, removeCart, increaseQuantity, decreaseQuantity, removeFromCart } = useCartStore();
  const router = useRouter();
  const { initPaymentSheet, presentPaymentSheet, confirmPayment } = useStripe();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardComplete, setCardComplete] = useState(false);

  useEffect(() => {
    console.log("Cart Data in Checkout:", cart);
    if (cart.length === 0) {
      fetchCart();
    } // Fetch cart data when page loads
  }, []);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // This would typically fetch from your backend
  const setupPaymentSheet = async () => {
    setLoading(true);
    try {
      // Note: In a real implementation, you would get these values from your server
      const clientSecret = 'dummy_client_secret';

      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Your Store Name',
        paymentIntentClientSecret: clientSecret,
        // Enable Apple Pay / Google Pay if you've configured them
        allowsDelayedPaymentMethods: true,
      });

      if (error) {
        Alert.alert('Error', error.message);
      }
    } catch (e) {
      console.log('Payment sheet setup error:', e);
      Alert.alert('Error', 'There was a problem setting up the payment method');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSheetCheckout = async () => {
    setLoading(true);
    try {
      const { error } = await presentPaymentSheet();

      if (error) {
        Alert.alert('Payment failed', error.message);
      } else {
        Alert.alert('Success', 'Your payment was successful!');
        // Here you would typically clear the cart and navigate to an order confirmation screen
      }
    } catch (e) {
      console.log('Payment error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCardPayment = async () => {
    if (!cardComplete) {
      Alert.alert('Error', 'Please complete card details');
      return;
    }

    setLoading(true);
    try {
      // In a real implementation, you would get the client secret from your server
      const clientSecret = 'dummy_client_secret';

      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });

      if (error) {
        Alert.alert('Payment failed', error.message);
      } else if (paymentIntent) {
        Alert.alert('Success', 'Your payment was successful!');
        // Handle successful payment
      }
    } catch (e) {
      console.log('Confirm payment error:', e);
      Alert.alert('Error', 'There was a problem processing your payment');
    } finally {
      setLoading(false);
    }
  };

  // Initialize payment sheet on component mount
  useEffect(() => {
    if (cart.length > 0) {
      setupPaymentSheet();
    }
  }, [cart]);

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="flex-1 p-4">
        <Text className="text-xl font-bold text-center mb-4">Checkout</Text>

        {/* Address Selector Component */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <Text className="font-semibold mb-2">Delivery Address</Text>
          <AddressSelector />
        </View>

        {/* Order Summary */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <Text className="font-semibold mb-2">Order Summary</Text>
          {cart.length === 0 ? (
            <Text className="text-center text-gray-500">Your cart is empty.</Text>
          ) : (
            <View className="space-y-3">
              {cart.map((item) => (
                <View key={item.id} className="flex-row items-center justify-between py-2 border-b border-gray-100">
                  <View className="flex-row items-center">
                    <Image source={{ uri: item.image }} className="w-10 h-10 rounded-md" />
                    <View className="ml-3">
                      <Text className="font-medium">{item.name}</Text>
                      <Text className="text-gray-500">\u20b9{item.price} � {item.quantity}</Text>
                    </View>
                  </View>
                  <Text className="font-semibold">\u20b9{(item.price * item.quantity).toFixed(2)}</Text>
                </View>
              ))}

              {/* Price Summary */}
              <View className="mt-3 pt-3 border-t border-gray-200">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-gray-600">Subtotal</Text>
                  <Text className="font-medium">\u20b9{getTotalPrice().toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between mb-1">
                  <Text className="text-gray-600">Delivery</Text>
                  <Text className="font-medium">\u20b950.00</Text>
                </View>
                <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-200">
                  <Text className="font-bold">Total</Text>
                  <Text className="font-bold">\u20b9{(getTotalPrice() + 50).toFixed(2)}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Payment Methods */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <Text className="font-semibold mb-3">Payment Method</Text>

          {/* Payment Method Selector */}
          <View className="mb-4">
            <TouchableOpacity
              className={`flex-row items-center p-3 rounded-lg mb-2 ${paymentMethod === 'card' ? 'bg-gray-100 border border-gray-300' : 'border border-gray-200'}`}
              onPress={() => setPaymentMethod('card')}
            >
              <CreditCard size={20} color={paymentMethod === 'card' ? '#000' : '#6B7280'} />
              <Text className={`ml-2 ${paymentMethod === 'card' ? 'font-semibold' : 'text-gray-600'}`}>Credit/Debit Card</Text>
              {paymentMethod === 'card' && <Check size={16} color="green" className="ml-auto" />}
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-row items-center p-3 rounded-lg ${paymentMethod === 'cashOnDelivery' ? 'bg-gray-100 border border-gray-300' : 'border border-gray-200'}`}
              onPress={() => setPaymentMethod('cashOnDelivery')}
            >
              <Text className="font-bold">\u20b9</Text>
              <Text className={`ml-2 ${paymentMethod === 'cashOnDelivery' ? 'font-semibold' : 'text-gray-600'}`}>Cash on Delivery</Text>
              {paymentMethod === 'cashOnDelivery' && <Check size={16} color="green" className="ml-auto" />}
            </TouchableOpacity>
          </View>

          {/* Card Form */}
          {paymentMethod === 'card' && (
            <View className="mb-3">
              <CardForm
                style={{ height: 200 }}
                cardStyle={{
                  backgroundColor: '#FFFFFF',
                  textColor: '#000000',
                }}
                onFormComplete={(cardDetails) => {
                  console.log('Card details complete:', cardDetails);
                  setCardComplete(cardDetails.complete);

                }}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Checkout Buttons */}
      <View className="p-4 bg-white border-t border-gray-200">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-gray-600">Total Amount</Text>
          <Text className="text-xl font-bold">\u20b9{(getTotalPrice() + 50).toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-2 bg-gray-200 py-3 rounded-lg"
        >
          <Text className="text-gray-800 text-center font-semibold">Back to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={loading || (paymentMethod === 'card' && !cardComplete)}
          onPress={paymentMethod === 'card' ? handleCardPayment : () => {
            Alert.alert('Order Placed', 'Your cash on delivery order has been placed successfully!');
            removeCart();
          }}
          className={`bg-black py-3 rounded-lg ${(loading || (paymentMethod === 'card' && !cardComplete)) ? 'opacity-70' : ''}`}
        >
          <Text className="text-white text-center font-semibold">
            {loading ? 'Processing...' : 'Place Order'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CheckoutScreen;