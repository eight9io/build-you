import RootNavigation from './navigation';
import { MenuProvider } from 'react-native-popup-menu';
import {
  useFonts,
  OpenSans_300Light,
  OpenSans_400Regular,
  OpenSans_500Medium,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';

import './i18n/i18n';
import Toast from './component/common/Toast/Toast';

export const App = () => {
  const [fontLoaded] = useFonts({
    OpenSans_300Light,
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
  });

  if (!fontLoaded) {
    return null;
  }

  return (
    <MenuProvider>
      <Toast />
      <RootNavigation />
    </MenuProvider>
  );
};

export default App;
