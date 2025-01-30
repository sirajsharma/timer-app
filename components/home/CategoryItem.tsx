import { FlatList } from "react-native";

import { AccordionItem } from "@/components/ui/accordion";
import { Divider } from "@/components/ui/divider";

import { TimerType } from "@/types/timer";

import { CategoryHeader } from "./CategoryHeader";
import CategoryBody from "./CategoryBody";

type CategoryItemProps = {
  timers: TimerType[];
  category: string;
};

export default function CategoryItem(props: CategoryItemProps) {
  const { timers, category } = props;

  return (
    <>
      <AccordionItem value={category} variant="unfilled">
        <CategoryHeader category={category} timers={timers} />
        <FlatList
          data={timers}
          renderItem={({ item }) => <CategoryBody {...item} />}
        />
      </AccordionItem>
      <Divider />
    </>
  );
}
