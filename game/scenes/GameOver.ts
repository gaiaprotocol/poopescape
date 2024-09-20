import { HybridAppBridge } from "@common-module/hybrid-bridge";
import {
  BackgroundMusic,
  DomWrapperNode,
  Scene,
  SFXPlayer,
  TextNode,
} from "@gaiaengine/2d";
import AppConfig from "../AppConfig.js";
import Stage from "./Stage.js";

export default class GameOver extends Scene {
  private static gameOverCount = 0;

  protected bgm = new BackgroundMusic({ mp3: "/assets/main-bgm.mp3" }).play();

  constructor(lastStage: Stage) {
    super();
    this.append(
      new TextNode(0, -120, "Game Over", {
        fontSize: "48px",
        color: "red",
        width: "270px",
        textAlign: "center",
      }),
      new DomWrapperNode(0, 110, "a", "Start", {
        style: {
          border: "1px solid white",
          backgroundColor: "#333",
          padding: "14px 36px",
          borderRadius: "5px",
          fontSize: "24px",
        },
        onclick: () => {
          lastStage.remove();
          this.transitionTo(Stage);
        },
        ...(AppConfig.isRunningInApp
          ? [
            new DomWrapperNode(
              136,
              -284,
              ".settings-button-container",
              /*new Button({
                type: ButtonType.Contained,
                icon: new MaterialIcon("settings"),
                click: () => new SettingsPopup(),
              }),*/
            ),
            new DomWrapperNode(0, 200, "a", "Leaderboard", {
              style: {
                border: "1px solid white",
                backgroundColor: "#333",
                padding: "10px 20px",
                borderRadius: "22px",
              },
              onclick: () => HybridAppBridge.sendToApp("showLeaderboard"),
            }),
          ]
          : []),
      }),
    );

    SFXPlayer.play("/assets/game-over.wav");

    GameOver.gameOverCount += 1;
    if (GameOver.gameOverCount % 2 === 0) {
      HybridAppBridge.sendToApp("showInterstitialAd");
    }

    HybridAppBridge.sendToApp("submitScore", { score: lastStage.score });
    HybridAppBridge.sendToApp("showBannerAd");
  }
}
