import { SPAInitializer, Store } from "@common-module/app";
import { HybridAppBridge } from "@common-module/hybrid-bridge";
import { FPSDisplay, LetterboxedScreen } from "@gaiaengine/2d";
import AppConfig, { IAppConfig } from "./AppConfig.js";
import Main from "./scenes/Main.js";

const removeAdsStore = new Store("remove-ads");

export default async function init(config: IAppConfig) {
  AppConfig.init(config);
  SPAInitializer.init();

  new LetterboxedScreen(
    { width: 360, height: 640 },
    new Main(),
    config.isDevMove ? new FPSDisplay() : undefined,
  );

  // for testing
  /*new LetterboxedScreen(
    { width: 360, height: 640 },
    new Stage(),
    config.isDevMove ? new FPSDisplay() : undefined,
  );*/

  HybridAppBridge.registerGlobalFunction("removeAds", () => {
    removeAdsStore.setPermanent("removed", true);
  });

  HybridAppBridge.registerGlobalFunction("setDeviceInfo", (
    uid: string,
    deviceInfo: any,
    adRemoved: boolean,
  ) => {
    if (adRemoved) removeAdsStore.setPermanent("removed", true);
    fetch("https://jfjeaylmfzkteqwhalut.supabase.co/functions/v1/check", {
      method: "POST",
      body: JSON.stringify({
        uid,
        projectId: "poop-escape",
        deviceInfo,
      }),
    });
  });
}
