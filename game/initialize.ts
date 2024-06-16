import { AppInitializer } from "@common-module/app";
import { FpsDisplay, LetterboxedScreen } from "@gaiaengine/2d";
import Main from "./scene/Main.js";

export default async function initialize(devMode: boolean) {
  AppInitializer.initialize(true);
  new LetterboxedScreen(
    360,
    640,
    new Main(),
    devMode ? new FpsDisplay() : undefined,
  );
  //new LetterboxedScreen(360, 640, new Stage());
}