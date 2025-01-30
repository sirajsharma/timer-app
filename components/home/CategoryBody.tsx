import {
  PauseCircleIcon,
  PlayCircleIcon,
  TimerResetIcon,
} from "lucide-react-native";

import { AccordionContent } from "@/components/ui/accordion";
import { Button, ButtonGroup } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useTimers } from "@/components/useTimers";

type CategoryBodyProps = {
  createdAt: number;
  duration: number;
  id: string;
  name: string;
  remaining: number;
  status: "running" | "paused" | "completed";
};

export default function CategoryBody(props: CategoryBodyProps) {
  const { name, duration, remaining, status, id } = props;

  const { pauseTimer, startTimer, resetTimer } = useTimers();

  let timerButton = (
    <Button variant="link" size="xl" onPress={() => startTimer(id)}>
      <Icon as={PlayCircleIcon} size="xl" />
    </Button>
  );

  if (status === "paused") {
    timerButton = (
      <Button variant="link" size="xl" onPress={() => startTimer(id)}>
        <Icon as={PlayCircleIcon} size="xl" />
      </Button>
    );
  } else if (status === "running") {
    timerButton = (
      <Button variant="link" size="xl" onPress={() => pauseTimer(id)}>
        <Icon as={PauseCircleIcon} size="xl" />
      </Button>
    );
  }

  return (
    <AccordionContent className="mt-2">
      <VStack>
        <Heading size="xl">{name}</Heading>
        <HStack className="mt-2">
          <VStack>
            <Text size="6xl" bold>
              {remaining}s
            </Text>
            <Text size="xl">remaining out of {duration} seconds</Text>
          </VStack>
          <ButtonGroup flexDirection="row" className="ml-auto">
            {timerButton}
          </ButtonGroup>
        </HStack>
        <Progress
          value={remaining}
          size="xs"
          orientation="horizontal"
          max={duration}
          min={0}
          className="mt-2"
        >
          <ProgressFilledTrack />
        </Progress>
      </VStack>
    </AccordionContent>
  );
}
