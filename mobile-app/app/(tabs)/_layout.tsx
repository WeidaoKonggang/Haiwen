import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLanguage } from '@/src/state/LanguageContext';
import { colors, sizing } from '@/src/theme';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={sizing.tabIcon} style={{ marginBottom: -2 }} {...props} />;
}

export default function TabLayout() {
  const { copy } = useLanguage();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.tabBorder,
          height: sizing.tabBarBaseHeight + Math.max(insets.bottom, 10),
          paddingBottom: Math.max(insets.bottom, 10),
          paddingTop: 5,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: copy.tabs.briefing,
          tabBarIcon: ({ color }) => <TabBarIcon name="newspaper-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="ask"
        options={{
          title: copy.tabs.ask,
          tabBarIcon: ({ color }) => <TabBarIcon name="comments-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: copy.tabs.saved,
          tabBarIcon: ({ color }) => <TabBarIcon name="bookmark-o" color={color} />,
        }}
      />
    </Tabs>
  );
}
