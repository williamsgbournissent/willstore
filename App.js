import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import MainNavigator from "./src/navigation/MainNavigator";
import { Provider } from "react-redux";
import { store } from "./src/store";
// Asegurar que los assets se carguen correctamente
import { Asset } from "expo-asset";
import { Image } from "react-native";

// Precargar imágenes
function cacheImages(images) {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    "Karla-Regular": require("./assets/fonts/Karla-Regular.ttf"),
    "Karla-Bold": require("./assets/fonts/Karla-Bold.ttf"),
    "Karla-Light": require("./assets/fonts/Karla-Light.ttf"),
    "Karla-Italic": require("./assets/fonts/Karla-Italic.ttf"),
    "PressStart2P-Regular": require("./assets/fonts/PressStart2P-Regular.ttf"),
  });

  useEffect(() => {
    async function loadResourcesAsync() {
      try {
        // Precarga las imágenes de las categorías
        const imageAssets = cacheImages([
          require("./assets/favicon.png"),
          require("./assets/icon.png"),
          // Agrega aquí otras imágenes locales
        ]);

        await Promise.all([...imageAssets]);
      } catch (e) {
        console.warn("Error cargando recursos:", e);
      }
    }

    loadResourcesAsync();

    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Provider store={store}>
      <StatusBar style="light" />
      <MainNavigator />
    </Provider>
  );
}
