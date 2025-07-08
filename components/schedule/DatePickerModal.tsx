import React from "react";

import { Picker } from "@react-native-picker/picker";
import dayjs from "dayjs";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface DatePickerModalProps {
  visible: boolean;
  tempDate: string;
  onClose: () => void;
  onConfirm: () => void;
  onDateChange: (date: string) => void;
}

export default function DatePickerModal({
  visible,
  tempDate,
  onClose,
  onConfirm,
  onDateChange,
}: DatePickerModalProps) {
  const generateYears = () => {
    const currentYear = dayjs().year();
    return Array.from({ length: 6 }, (_, i) => currentYear + i);
  };

  const generateMonths = () => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  const years = generateYears();
  const months = generateMonths();
  const currentYear = dayjs(tempDate).year();
  const currentMonth = dayjs(tempDate).month() + 1;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="mx-4 w-80 rounded-2xl bg-white p-6">
          <Text className="mb-4 text-center text-lg font-semibold text-gray-900">
            연도와 월을 선택하세요
          </Text>

          <View className="flex-row justify-between">
            <View className="mr-2 flex-1">
              <Text className="mb-2 text-center text-sm font-medium text-gray-700">
                연도
              </Text>
              <View className="h-32 overflow-hidden rounded-lg border border-gray-200 bg-white">
                <Picker
                  selectedValue={currentYear}
                  onValueChange={(itemValue) => {
                    const newDate = dayjs(tempDate)
                      .year(itemValue)
                      .format("YYYY-MM-DD");
                    onDateChange(newDate);
                  }}
                  style={{
                    height: 128,
                    width: "100%",
                  }}
                  itemStyle={{
                    height: 128,
                    fontSize: 16,
                    color: "#1f2937",
                  }}
                >
                  {years.map((year) => (
                    <Picker.Item
                      key={year}
                      label={year.toString()}
                      value={year}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View className="ml-2 flex-1">
              <Text className="mb-2 text-center text-sm font-medium text-gray-700">
                월
              </Text>
              <View className="h-32 overflow-hidden rounded-lg border border-gray-200 bg-white">
                <Picker
                  selectedValue={currentMonth}
                  onValueChange={(itemValue) => {
                    const newDate = dayjs(tempDate)
                      .month(itemValue - 1)
                      .format("YYYY-MM-DD");
                    onDateChange(newDate);
                  }}
                  style={{
                    height: 128,
                    width: "100%",
                  }}
                  itemStyle={{
                    height: 128,
                    fontSize: 16,
                    color: "#1f2937",
                  }}
                >
                  {months.map((month) => (
                    <Picker.Item
                      key={month}
                      label={`${month}월`}
                      value={month}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          <View className="mt-6 flex-row justify-end">
            <TouchableOpacity
              className="mr-3 rounded-lg bg-gray-100 px-4 py-2"
              onPress={onClose}
            >
              <Text className="text-gray-600">취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-lg bg-blue-600 px-4 py-2"
              onPress={onConfirm}
            >
              <Text className="text-white">확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
