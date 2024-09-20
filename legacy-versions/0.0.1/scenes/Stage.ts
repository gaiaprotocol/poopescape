import {
  ArrayUtil,
  Bgm,
  BrowserInfo,
  Button,
  ButtonType,
  MaterialIcon,
  Sound,
} from "@common-module/app";
import {
  Background,
  CollisionChecker,
  Dom,
  Sprite,
  Text,
  WindowEventNode,
} from "@gaiaengine/2d";
import SettingsPopup from "../components/SettingsPopup.js";
import Env from "../Env.js";
import Hero from "../objects/Hero.js";
import Poop from "../objects/Poop.js";

let gameOverCount = 0;

export default class Stage extends WindowEventNode {
  private bgm = new Bgm({ mp3: "/assets/main-bgm.mp3" });

  private point = 0;
  private isGameOver = false;

  private pointDisplay: Text;
  private hero: Hero;
  private fallingPoops: Poop[] = [];
  private leftArrow: Sprite | undefined;
  private rightArrow: Sprite | undefined;

  /*
  private interval: Interval;
  private intervalCount = 0;
  private period = 5;
  */

  private collisionChecker: CollisionChecker<Poop>;

  private leftTouchActive = false;
  private rightTouchActive = false;

  constructor() {
    super(0, 0);

    this.append(
      new Background("/assets/background.png"),
      this.pointDisplay = new Text(0, -290, "Point: 0", {
        fontSize: 25,
        color: "#000",
      }),
      this.hero = new Hero(0, 200),
      ...(BrowserInfo.isMobileDevice
        ? [
          this.leftArrow = new Sprite(-100, 250, "/assets/arrow.png"),
          this.rightArrow = new Sprite(100, 250, "/assets/arrow.png"),
        ]
        : []),
    );

    if (this.leftArrow) {
      this.leftArrow.alpha = 0.2;
      this.leftArrow.scale = 0.5;
      this.leftArrow.rotation = Math.PI;
    }
    if (this.rightArrow) {
      this.rightArrow.alpha = 0.2;
      this.rightArrow.scale = 0.5;
    }

    this.setupTouchEvents();
    this.setupKeyboardEvents();

    /*
    this.interval = new Interval(0.1, () => {
      if (this.intervalCount % this.period === 0) this.createPoop();
      if (this.period > 1 && this.intervalCount % 100 === 0) {
        this.period -= 1;
        this.intervalCount = 0;
      }
      this.intervalCount += 1;
    }).appendTo(this);
    */

    this.collisionChecker = new CollisionChecker<Poop>(
      this.hero,
      this.fallingPoops,
      (collidedPoop) => {
        collidedPoop.dropped();
        this.gameOver();
      },
    ).appendTo(this);

    new Sound({ wav: "/assets/start-game.wav" }).play();

    if ((window as any).messageHandler) {
      (window as any).messageHandler.postMessage(
        JSON.stringify({ method: "hideBannerAd" }),
      );
    }
  }

  private setupTouchEvents() {
    this.onWindow("touchstart", (event: TouchEvent) => {
      Array.from(event.touches).forEach((touch) => {
        if (touch.clientX < window.innerWidth / 2) {
          this.leftTouchActive = true;
        } else {
          this.rightTouchActive = true;
        }
      });
      this.updateHeroMovement();
    });

    this.onWindow("touchmove", (event: TouchEvent) => {
      this.leftTouchActive = false;
      this.rightTouchActive = false;
      Array.from(event.touches).forEach((touch) => {
        if (touch.clientX < window.innerWidth / 2) {
          this.leftTouchActive = true;
        } else {
          this.rightTouchActive = true;
        }
      });
      this.updateHeroMovement();
    });

    this.onWindow("touchend", (event: TouchEvent) => {
      if (event.touches.length === 0) {
        this.leftTouchActive = false;
        this.rightTouchActive = false;
      } else {
        this.leftTouchActive = false;
        this.rightTouchActive = false;
        Array.from(event.touches).forEach((touch) => {
          if (touch.clientX < window.innerWidth / 2) {
            this.leftTouchActive = true;
          } else {
            this.rightTouchActive = true;
          }
        });
      }
      this.updateHeroMovement();
    });
  }

  private updateHeroMovement() {
    if (this.leftTouchActive && !this.rightTouchActive) {
      this.hero.moveLeft();
    } else if (this.rightTouchActive && !this.leftTouchActive) {
      this.hero.moveRight();
    } else {
      this.hero.stop();
    }
  }

  private setupKeyboardEvents() {
    this.onWindow("keydown", (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") this.hero.moveLeft();
      else if (event.key === "ArrowRight") this.hero.moveRight();
    });

    this.onWindow("keyup", (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") this.hero.stopLeft();
      if (event.key === "ArrowRight") this.hero.stopRight();
    });
  }

  private createPoop() {
    const poop: Poop = new Poop(() => {
      ArrayUtil.pull(this.fallingPoops, poop);
      if (!this.isGameOver) this.increasePoint();
    }).appendTo(this);
    this.fallingPoops.push(poop);
  }

  private increasePoint() {
    this.point += 1;
    this.pointDisplay.text = `Point: ${this.point}`;
  }

  private timeElapsed = 0;
  private poopSpawnInterval = 0.35;

  protected update(deltaTime: number): void {
    super.update(deltaTime);
    if (this.isGameOver) return;

    this.timeElapsed += deltaTime;
    if (this.timeElapsed >= this.poopSpawnInterval) {
      this.createPoop();
      this.timeElapsed = 0;
      if (this.poopSpawnInterval > 0.1) this.poopSpawnInterval -= 0.001;
    }
  }

  private gameOver() {
    this.hero.dead();
    //this.interval.delete();
    this.collisionChecker.delete();
    this.isGameOver = true;

    this.append(
      new Text(0, -120, "Game Over", {
        fontSize: 48,
        color: "red",
      }),
      new Dom(0, 110, "a", "Start", {
        style: {
          border: "1px solid white",
          backgroundColor: "#333",
          padding: "14px 36px",
          borderRadius: "5px",
          fontSize: "24px",
        },
        click: () => {
          if (this.parent) new Stage().appendTo(this.parent);
          this.delete();
        },
      }),
      Env.isApp
        ? new Dom(
          136,
          -284,
          ".settings-button-container",
          new Button({
            type: ButtonType.Contained,
            icon: new MaterialIcon("settings"),
            click: () => new SettingsPopup(),
          }),
        )
        : undefined,
      Env.isApp
        ? new Dom(0, 200, "a", "Leaderboard", {
          style: {
            border: "1px solid white",
            backgroundColor: "#333",
            padding: "10px 20px",
            borderRadius: "22px",
          },
          click: () => {
            if ((window as any).messageHandler) {
              (window as any).messageHandler.postMessage(
                JSON.stringify({ method: "showLeaderboard" }),
              );
            }
          },
        })
        : undefined,
    );

    new Sound({ wav: "/assets/game-over.wav" }).play();
    this.bgm.play();

    gameOverCount += 1;
    if (gameOverCount % 2 === 0 && (window as any).messageHandler) {
      (window as any).messageHandler.postMessage(
        JSON.stringify({ method: "showInterstitialAd" }),
      );
    }

    if ((window as any).messageHandler) {
      (window as any).messageHandler.postMessage(
        JSON.stringify({ method: "submitScore", score: this.point }),
      );
    }

    if ((window as any).messageHandler) {
      (window as any).messageHandler.postMessage(
        JSON.stringify({ method: "showBannerAd" }),
      );
    }
  }

  public delete(): void {
    this.bgm.delete();
    super.delete();
  }
}
