import React from "react";
import { Tabs } from "expo-router";
import { Home, History, LucideIcon } from "lucide-react-native";

import { Icon } from "@/components/ui/icon";

function TabBarIcon(props: { icon: LucideIcon; color: string }) {
  return <Icon as={props.icon} size="md" className="text-typography-500" />;
}

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon icon={Home} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <TabBarIcon icon={History} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
