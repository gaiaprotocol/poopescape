import { AppInitializer } from "@common-module/app";
import { LetterboxedScreen } from "@gaiaengine/gaiaengine";
import Stage from "./scene/Stage.js";

export default async function initialize() {
  AppInitializer.initialize(true);
  //new LetterboxedScreen(360, 640, new Main());
  new LetterboxedScreen(360, 640, new Stage());
}
