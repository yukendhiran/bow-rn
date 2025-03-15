import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton } from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { Icon, CloseIcon } from "@/components/ui/icon";
import axiosInstance from "@/config/axios";
import { useAuthStore } from "@/store/auth/useAuthStore";

const AddressSelector = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("Select Delivery Address");
  const token = useAuthStore((state) => state.token);
  const firstItemRef = useRef(null);

  useEffect(() => {
    if (token) {
      fetchAddresses();
    }
  }, [token]);

  const fetchAddresses = async () => {
    try {
      const response = await axiosInstance.get("/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      setAddresses(response.data);
    } catch (error) {
      console.error("Error fetching addresses", error);
    }
  };

  interface Address {
    id: number;
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  }

  const formatAddress = (address: Address) => {
    return `${address.street}, ${address.city}, ${address.state}, ${address.zip_code}, ${address.country}`;
  };

  const selectAddress = (address: Address) => {
    setSelectedAddress(formatAddress(address));
    setModalVisible(false);
  };

  return (
    <View className="bg-white p-4 rounded-lg shadow-md">

      {/* Restaurant Location */}
      <Text className="font-bold text-lg">Restaurant Location</Text>
      <Text className="text-gray-500">Unit No.1, Ground Floor, XYZ Street</Text>


      <View className="border-t border-gray-300 my-3"></View>

      {/* Delivery Address Selector */}
      <Button onPress={() => setModalVisible(true)} className="w-full h-16 rounded-lg">
        <ButtonText>{selectedAddress} ▼</ButtonText>
      </Button>


      {/* Address Selection Modal */}
      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        size="md"
        avoidKeyboard={true}
        closeOnOverlayClick={true}
        isKeyboardDismissable={true}
        initialFocusRef={firstItemRef}
      >
        <ModalBackdrop />
        <ModalContent focusable={true}>
          <ModalHeader>
            <Heading size="md" className="text-typography-950">
              Select Delivery Address
            </Heading>
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody>
            <View>
              {addresses.map((item, index) => (
                <Button
                  key={item.id.toString()}
                  ref={index === 0 ? firstItemRef : null}
                  variant="outline"
                  className="w-full mb-2 h-16"
                  onPress={() => selectAddress(item)}
                >
                  <ButtonText className="text-left">{formatAddress(item)}</ButtonText>
                </Button>
              ))}
            </View>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" action="secondary" onPress={() => setModalVisible(false)}>
              <ButtonText>Cancel</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </View>
  );
};

export default AddressSelector;
