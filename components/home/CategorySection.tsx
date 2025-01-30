import { useMemo } from "react";
import { FlatList } from "react-native";

import { Accordion } from "@/components/ui/accordion";
import { Divider } from "@/components/ui/divider";

import CategoryItem from "./CategoryItem";

import { useTimers } from "../useTimers";
import { TimerType } from "@/types/timer";

export default function CategorySection() {
  const { timers } = useTimers();

  const categorisedTimers = useMemo(() => {
    return timers.reduce((acc, timer) => {
      if (!acc[timer.category]) {
        acc[timer.category] = [];
      }
      acc[timer.category].push(timer);
      return acc;
    }, {} as Record<string, TimerType[]>);
  }, [JSON.stringify(timers)]);

  return (
    <Accordion
      size="md"
      variant="filled"
      type="single"
      isCollapsible={true}
      isDisabled={false}
    >
      <FlatList
        data={Object.keys(categorisedTimers)}
        renderItem={({ item: category }) => (
          <CategoryItem
            category={category}
            timers={categorisedTimers[category]}
          />
        )}
      />
    </Accordion>
  );
}
