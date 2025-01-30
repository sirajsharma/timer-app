import { useState } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AlertCircleIcon, ChevronDownIcon } from "lucide-react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { VStack } from "@/components/ui/vstack";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";

import { useTimers } from "@/components/useTimers";

import { Categories } from "@/constants/Categories";

import { CategoryType, TimerType } from "@/types/timer";

export default function CreateTimerScreen() {
  const navigation = useNavigation();

  const { setTimers } = useTimers();

  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [isNameValid, setIsNameValid] = useState(true);
  const [isDurationValid, setIsDurationValid] = useState(true);
  const [isCategoryValid, setIsCategoryValid] = useState(true);

  const validateForm = () => {
    if (!name.trim()) {
      setIsNameValid(false);
    } else {
      setIsNameValid(true);
    }

    if (!duration || isNaN(Number(duration)) || Number(duration) <= 0) {
      setIsDurationValid(false);
    } else {
      setIsDurationValid(true);
    }

    if (!category) {
      setIsCategoryValid(false);
    } else {
      setIsCategoryValid(true);
    }
  };

  const handleCreateTimer = async () => {
    validateForm();

    if (
      !name.trim() ||
      !duration ||
      isNaN(Number(duration)) ||
      Number(duration) <= 0 ||
      !category
    ) {
      return;
    }

    const newTimer: TimerType = {
      id: uuidv4(),
      name,
      category: category as CategoryType,
      createdAt: new Date().getMilliseconds(),
      duration: Number(duration),
      remaining: Number(duration),
      status: "paused",
    };

    try {
      setTimers((prev) => [...prev, newTimer]);

      Alert.alert(
        "Success",
        "Timer created successfully.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
            isPreferred: true,
            style: "default",
          },
        ],
        {
          onDismiss: () => navigation.goBack(),
        }
      );
    } catch (error) {
      console.error("Error saving timer:", error);
      Alert.alert("Error", "Failed to create timer");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <VStack style={styles.container} className="px-5 py-4">
        <FormControl isRequired isInvalid={!isNameValid} className="mb-4">
          <FormControlLabel>
            <FormControlLabelText size="4xl">Name</FormControlLabelText>
          </FormControlLabel>
          <Input size="xl">
            <InputField
              type="text"
              placeholder="Enter name of the timer"
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </Input>
          <FormControlHelper>
            <FormControlHelperText size="lg">
              Name should be unique and descriptive.
            </FormControlHelperText>
          </FormControlHelper>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText size="lg">
              Name is required and should be unique.
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        <FormControl isRequired isInvalid={!isDurationValid} className="mb-4">
          <FormControlLabel>
            <FormControlLabelText size="4xl">Duration</FormControlLabelText>
          </FormControlLabel>
          <Input size="xl">
            <InputField
              type="text"
              placeholder="Enter duration in seconds"
              value={duration}
              onChangeText={(text) => setDuration(text)}
              keyboardType="numeric"
            />
          </Input>
          <FormControlHelper>
            <FormControlHelperText size="lg">
              Duration should be a positive number.
            </FormControlHelperText>
          </FormControlHelper>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText size="lg">
              Duration is required and should be a positive number.
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        <FormControl isRequired isInvalid={!isCategoryValid} className="mb-4">
          <FormControlLabel>
            <FormControlLabelText size="4xl">Category</FormControlLabelText>
          </FormControlLabel>
          <Select onValueChange={(value) => setCategory(value)}>
            <SelectTrigger size="xl">
              <SelectInput
                placeholder="Select option"
                className="flex-1"
                value={category}
              />
              <SelectIcon className="mr-3" as={ChevronDownIcon} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                {Object.values(Categories).map((category) => (
                  <SelectItem
                    key={category}
                    label={category}
                    value={category}
                  />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
          <FormControlHelper>
            <FormControlHelperText size="lg">
              Category should be selected from the list.
            </FormControlHelperText>
          </FormControlHelper>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText size="lg">
              Category is required and should be selected from the list.
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
        <Button
          className="width-full mt-5"
          size="xl"
          onPress={handleCreateTimer}
        >
          <ButtonText>Create Timer</ButtonText>
        </Button>
      </VStack>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
