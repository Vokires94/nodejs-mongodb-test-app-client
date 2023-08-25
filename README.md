# ReactNativeNavigation expo project

# Run in emulator

For local testing you need to have installed android studio or xcode depends on your OS(Windows/Mac OS) with configuration https://reactnative.dev/docs/environment-setup

For local testing use:
* cd navigation
* npm install
* expo start
* choose r to run in mobile device

* # Prepare expo apk buid
use manul for more details https://docs.expo.dev/build/setup/

* npm install -g eas-cli (skip if done already)
* eas login
* eas build:configure
* eas build --platform android or eas build --platform ios
* Wait for preparing build (about 5-10min)
* Choose N (not run in simulator)
* Then go to your expo home page https://expo.dev/ select your build and download
