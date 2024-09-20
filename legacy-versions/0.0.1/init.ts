import { AppInitializer, Store } from "@common-module/app";
import { FpsDisplay, LetterboxedScreen } from "@gaiaengine/2d";
import Env from "./Env.js";
import Main from "./scenes/Main.js";

const removeAdsStore = new Store("remove-ads");

export default async function init(config: { dev: boolean; isApp: boolean }) {
  Env.init(config);
  AppInitializer.initialize(true);

  new LetterboxedScreen(
    360,
    640,
    new Main(),
    config.dev ? new FpsDisplay() : undefined,
    { dev: config.dev },
  );
  //new LetterboxedScreen(360, 640, new Stage());

  (window as any).removeAds = () => {
    removeAdsStore.set("removed", true);
  };

  (window as any).setDeviceInfo = (
    uid: string,
    deviceInfo: any,
    adRemoved: boolean,
  ) => {
    if (adRemoved) removeAdsStore.set("removed", true);
    fetch("https://jfjeaylmfzkteqwhalut.supabase.co/functions/v1/check", {
      method: "POST",
      body: JSON.stringify({
        uid,
        projectId: "poop-escape",
        deviceInfo,
      }),
    });
  };
}
