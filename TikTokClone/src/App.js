import React, { useEffect, useState } from 'react';
import { YellowBox, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { Appearance, AppearanceProvider } from 'react-native-appearance';
import { MenuProvider } from 'react-native-popup-menu';
import { enableScreens } from 'react-native-screens';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import configureStore from './redux/store';
import AppContainer from './screens/AppContainer';

const MainContainer = AppContainer;
const store = configureStore();

const App = (props) => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  enableScreens();

  useEffect(() => {
    YellowBox.ignoreWarnings(['Remote Debugger']);
    console.disableYellowBox = true;

    Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
    });
  }, []);

  return (
    <Provider store={store}>
      <AppearanceProvider>
        <MenuProvider>
          <StatusBar />
          <BottomSheetModalProvider>
            <MainContainer screenProps={{ theme: colorScheme }} />
          </BottomSheetModalProvider>
        </MenuProvider>
      </AppearanceProvider>
    </Provider>
  );
};

export default App;
