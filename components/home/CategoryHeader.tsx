import { useMemo } from "react";
import {
  PlusIcon,
  MinusIcon,
  EllipsisVertical,
  PauseCircleIcon,
  TimerResetIcon,
} from "lucide-react-native";

import {
  AccordionHeader,
  AccordionTrigger,
  AccordionTitleText,
  AccordionIcon,
} from "@/components/ui/accordion";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { Icon, PlayIcon } from "@/components/ui/icon";
import { Divider } from "@/components/ui/divider";

import { useTimers } from "@/components/useTimers";

import { TimerType } from "@/types/timer";

type CategoryHeaderProps = {
  category: string;
  timers: TimerType[];
};

export function CategoryHeader(props: CategoryHeaderProps) {
  const { category, timers } = props;

  const { pauseTimer, resetTimer, startTimer } = useTimers();

  const handleResetAll = () => {
    timers.forEach((timer) => {
      resetTimer(timer.id);
    });
  };

  const handleStartAll = () => {
    timers.forEach((timer) => {
      startTimer(timer.id);
    });
  };

  const handlePauseAll = () => {
    timers.forEach((timer) => {
      pauseTimer(timer.id);
    });
  };

  const disabledKeys = useMemo(() => {
    const disabledKeys = [];
    if (
      timers.every(
        (timer) => timer.status === "running" || timer.status === "completed"
      )
    ) {
      disabledKeys.push("Start All");
    }

    if (
      timers.every(
        (timer) => timer.status === "paused" || timer.status === "completed"
      )
    ) {
      disabledKeys.push("Pause All");
    }

    return disabledKeys;
  }, [JSON.stringify(timers)]);

  return (
    <>
      <AccordionHeader className="py-1">
        <AccordionTrigger>
          {({ isExpanded }) => {
            return (
              <>
                {isExpanded ? (
                  <AccordionIcon as={MinusIcon} className="mr-3" />
                ) : (
                  <AccordionIcon as={PlusIcon} className="mr-3" />
                )}
                <AccordionTitleText>
                  <Heading size="3xl" className="capitalize">
                    {category}
                  </Heading>
                </AccordionTitleText>
                <Menu
                  placement="top"
                  offset={5}
                  trigger={({ ...triggerProps }) => {
                    return (
                      <Button
                        {...triggerProps}
                        variant="link"
                        accessibilityLabel="Show Bulk Actions"
                      >
                        <Icon as={EllipsisVertical} size="xl" />
                      </Button>
                    );
                  }}
                  disabledKeys={disabledKeys}
                >
                  <MenuItem
                    key="Start All"
                    textValue="Start All"
                    onPress={handleStartAll}
                  >
                    <Icon as={PlayIcon} size="lg" className="mr-2" />
                    <MenuItemLabel size="lg">Start All</MenuItemLabel>
                  </MenuItem>
                  <MenuItem
                    key="Pause All"
                    textValue="Pause All"
                    onPress={handlePauseAll}
                  >
                    <Icon as={PauseCircleIcon} size="lg" className="mr-2" />
                    <MenuItemLabel size="lg">Pause All</MenuItemLabel>
                  </MenuItem>
                  <MenuItem
                    key="Reset All"
                    textValue="Reset All"
                    onPress={handleResetAll}
                  >
                    <Icon as={TimerResetIcon} size="lg" className="mr-2" />
                    <MenuItemLabel size="lg">Reset All</MenuItemLabel>
                  </MenuItem>
                </Menu>
              </>
            );
          }}
        </AccordionTrigger>
      </AccordionHeader>
      <Divider />
    </>
  );
}
