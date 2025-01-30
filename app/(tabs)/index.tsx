import { StyleSheet, View } from "react-native";
import { useNavigation } from "expo-router";
import { PlusIcon, HourglassIcon } from "lucide-react-native";

import { Fab, FabIcon } from "@/components/ui/fab";
import { useTimers } from "@/components/useTimers";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";

import CategorySection from "@/components/home/CategorySection";

import { type StackNavigation } from "../_layout";

export default function HomeScreen() {
  const { timers } = useTimers();

  const navigation = useNavigation<StackNavigation>();

  const handleCreateTimer = () => {
    navigation.navigate("create");
  };

  return (
    <VStack style={styles.container}>
      {timers.length ? (
        <CategorySection />
      ) : (
        <Center style={styles.container}>
          <Text size="3xl">
            <Icon as={HourglassIcon} size="xl" /> No timers added yet.
          </Text>
          <Text size="3xl">
            Tap the {<Icon as={PlusIcon} size="xl" />} button to create one.
          </Text>
        </Center>
      )}
      <Fab size="lg" placement="bottom right" onPress={handleCreateTimer}>
        <FabIcon as={PlusIcon} size="xl" />
      </Fab>
    </VStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
