import { HybridAppBridge } from "@common-module/hybrid-bridge";
import {
  Background,
  BackgroundMusic,
  DomWrapperNode,
  Scene,
  TextNode,
} from "@gaiaengine/2d";
import AppConfig from "../AppConfig.js";
import Stage from "./Stage.js";

export default class Main extends Scene {
  protected bgm = new BackgroundMusic({ mp3: "/assets/main-bgm.mp3" }).play();

  constructor() {
    super();
    this.append(
      new Background("/assets/background.png", { scrollSpeedX: -100 }),
      new TextNode(0, -200, "Poop Escape", {
        fontSize: "48px",
        color: "#000",
        width: "270px",
        textAlign: "center",
      }),
      new TextNode(0, -120, "Made with Gaia Engine", {
        fontSize: "24px",
        color: "#000",
        width: "240px",
        textAlign: "center",
      }),
      new DomWrapperNode(0, 110, "a", "Start", {
        style: {
          border: "1px solid white",
          backgroundColor: "#333",
          padding: "14px 0",
          borderRadius: "5px",
          fontSize: "24px",
          width: "160px",
          textAlign: "center",
        },
        onclick: () => this.transitionTo(Stage),
      }),
      AppConfig.isRunningInApp
        ? new DomWrapperNode(0, 200, "a", "Leaderboard", {
          style: {
            border: "1px solid white",
            backgroundColor: "#333",
            padding: "10px 20px",
            borderRadius: "22px",
          },
          onclick: () => HybridAppBridge.sendToApp("showLeaderboard"),
        })
        : undefined,
    );

    HybridAppBridge.sendToApp("showBannerAd");
  }
}
