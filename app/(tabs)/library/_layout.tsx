import AppHeader from '@/components/header/AppHeader';
import { GUIDEBOOK_SCREEN_TITLE } from '@/app/search/data';
import { Stack } from 'expo-router';

export default function LibraryLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: GUIDEBOOK_SCREEN_TITLE,
          header: AppHeader,
        }}
      />
    </Stack>
  );
}
