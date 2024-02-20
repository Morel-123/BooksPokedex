import { registerRootComponent } from 'expo';
import { I18nManager } from "react-native";

import App from './App';

I18nManager.forceRTL(false);
I18nManager.allowRTL(false);
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
