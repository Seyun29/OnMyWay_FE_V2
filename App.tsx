/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {Platform, UIManager} from 'react-native';
import 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import RootStackNavigation from './src/navigations';
import {RecoilRoot} from 'recoil';
import Toast from 'react-native-toast-message';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import CodePush from 'react-native-code-push';

function App(): React.JSX.Element {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  return (
    <React.StrictMode>
      <RecoilRoot>
        <GestureHandlerRootView className="flex-1">
          <RootStackNavigation />
          <Toast />
        </GestureHandlerRootView>
      </RecoilRoot>
    </React.StrictMode>
  );
}

export default CodePush(App);
