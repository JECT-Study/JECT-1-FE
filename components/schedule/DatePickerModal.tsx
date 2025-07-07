import React from "react";

import dayjs from "dayjs";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";

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
              <ScrollView
                className="h-32 rounded-lg border border-gray-200"
                showsVerticalScrollIndicator={false}
              >
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    className={`p-3 ${
                      year === currentYear ? "bg-blue-50" : ""
                    }`}
                    onPress={() => {
                      const newDate = dayjs(tempDate)
                        .year(year)
                        .format("YYYY-MM-DD");
                      onDateChange(newDate);
                    }}
                  >
                    <Text
                      className={`text-center ${
                        year === currentYear
                          ? "font-semibold text-blue-600"
                          : "text-gray-900"
                      }`}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View className="ml-2 flex-1">
              <Text className="mb-2 text-center text-sm font-medium text-gray-700">
                월
              </Text>
              <ScrollView
                className="h-32 rounded-lg border border-gray-200"
                showsVerticalScrollIndicator={false}
              >
                {months.map((month) => (
                  <TouchableOpacity
                    key={month}
                    className={`p-3 ${
                      month === currentMonth ? "bg-blue-50" : ""
                    }`}
                    onPress={() => {
                      const newDate = dayjs(tempDate)
                        .month(month - 1)
                        .format("YYYY-MM-DD");
                      onDateChange(newDate);
                    }}
                  >
                    <Text
                      className={`text-center ${
                        month === currentMonth
                          ? "font-semibold text-blue-600"
                          : "text-gray-900"
                      }`}
                    >
                      {month}월
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
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
