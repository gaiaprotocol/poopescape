import { HybridAppBridge } from "@common-module/hybrid-bridge";
import {
  Background,
  CollisionDetector,
  Scene,
  SFXPlayer,
  TextNode,
} from "@gaiaengine/2d";
import { TwoWayJoystick } from "@gaiaengine/2d-joystick";
import { ArrayUtils, IntegerUtils } from "../../../ts-module/lib/index.js";
import Hero from "../objects/Hero.js";
import Poop from "../objects/Poop.js";
import GameOver from "./GameOver.js";

export default class Stage extends Scene {
  private pointDisplay;
  private hero;
  private fallingPoops: Poop[] = [];

  public score = 0;

  private isGameOver = false;
  private timeElapsed = 0;
  private poopSpawnInterval = 0.35;

  constructor() {
    super();

    this.append(
      new Background("/assets/background.png"),
      this.pointDisplay = new TextNode(0, -290, "Point: 0", {
        fontSize: "25px",
        color: "#000",
        width: "300px",
        textAlign: "center",
      }),
      this.hero = new Hero(0, 200),
      new TwoWayJoystick((direction) => {
        if (direction === "left") this.hero.moveLeft();
        else if (direction === "right") this.hero.moveRight();
      }, (direction) => {
        if (direction === "left") this.hero.stopMovingLeft();
        else if (direction === "right") this.hero.stopMovingRight();
      }),
      new CollisionDetector([this.hero], this.fallingPoops, (hero, poop) => {
        hero.die();
        poop.changeStateToDropped();
        this.gameOver();
      }),
    );

    SFXPlayer.play("/assets/start-game.wav");
    HybridAppBridge.sendToApp("hideBannerAd");
  }

  private increasePoint() {
    this.score += 1;
    this.pointDisplay.text = `Point: ${this.score}`;
  }

  private createPoop() {
    this.fallingPoops.push(
      new Poop(IntegerUtils.random(-180, 180), -320).appendTo(this),
    );
  }

  private gameOver() {
    if (!this.isGameOver) {
      this.isGameOver = true;
      this.screen?.root.append(new GameOver(this));
    }
  }

  protected update(deltaTime: number): void {
    super.update(deltaTime);

    // Check if the hero is out of bounds
    if (this.hero.x < -180) this.hero.x = -180;
    if (this.hero.x > 180) this.hero.x = 180;

    // Create poop every poopSpawnInterval
    if (!this.isGameOver) {
      this.timeElapsed += deltaTime;
      if (this.timeElapsed >= this.poopSpawnInterval) {
        this.createPoop();
        this.timeElapsed = 0;
        if (this.poopSpawnInterval > 0.1) this.poopSpawnInterval -= 0.001;
      }
    }

    // Check if the poop has reached the ground
    for (const poop of this.fallingPoops) {
      if (poop.y > 235) {
        poop.drop().y = 235;
        ArrayUtils.pull(this.fallingPoops, poop);
        if (!this.isGameOver) this.increasePoint();
      }
    }
  }
}
