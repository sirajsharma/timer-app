import { useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { HistoryIcon, Trash2Icon } from "lucide-react-native";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogBackdrop,
} from "@/components/ui/alert-dialog";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Center } from "@/components/ui/center";
import { Icon } from "@/components/ui/icon";

import { useTimers } from "@/components/useTimers";

export default function HistoryScreen() {
  const { deleteHistory, history } = useTimers();

  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const handleClose = () => setShowAlertDialog(false);

  if (!history.length) {
    return (
      <Center style={styles.container}>
        <Text size="3xl">
          <Icon as={HistoryIcon} size="xl" /> No history available
        </Text>
        <Text size="md">Start completing timers to see history.</Text>
      </Center>
    );
  }

  return (
    <VStack style={styles.container}>
      <FlatList
        data={history}
        renderItem={({ item }) => (
          <Card size="md" variant="outline" className="m-3">
            <Heading size="3xl" className="mb-1">
              {item.name}
            </Heading>
            <Text size="lg">Completed on: {item.completedAt}</Text>
          </Card>
        )}
      />
      <Fab
        size="lg"
        placement="bottom right"
        onPress={() => setShowAlertDialog(true)}
      >
        <FabIcon as={Trash2Icon} size="xl" />
      </Fab>

      <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              Are you sure you want to delete history?
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text size="sm">
              Deleting the history will remove it permanently and cannot be
              undone. Please confirm if you want to proceed.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter className="">
            <Button
              variant="outline"
              action="secondary"
              onPress={handleClose}
              size="sm"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button size="sm" onPress={deleteHistory}>
              <ButtonText>Delete</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </VStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
