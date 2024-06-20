import { AppInitializer } from "@common-module/app";
import { FpsDisplay, LetterboxedScreen } from "@gaiaengine/2d";
import Config from "./Config.js";
import Env from "./Env.js";
import Main from "./scene/Main.js";

export default async function initialize(config: Config) {
  Env.init(config);
  AppInitializer.initialize(true);

  new LetterboxedScreen(
    360,
    640,
    new Main(),
    config.dev ? new FpsDisplay() : undefined,
  );
  //new LetterboxedScreen(360, 640, new Stage());
}
