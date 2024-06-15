import { ArrayUtil, Sound } from "@common-module/app";
import {
  Background,
  CollisionChecker,
  Dom,
  Interval,
  Text,
  WindowEventNode,
} from "@gaiaengine/gaiaengine";
import Hero from "../object/Hero.js";
import Poop from "../object/Poop.js";

export default class Stage extends WindowEventNode {
  private point = 0;
  private isGameOver = false;

  private pointDisplay: Text;
  private hero: Hero;
  private fallingPoops: Poop[] = [];

  private interval: Interval;
  private intervalCount = 0;
  private period = 5;
  private collisionChecker: CollisionChecker<Poop>;

  constructor() {
    super(0, 0);

    this.append(
      new Background("/assets/background.png"),
      this.pointDisplay = new Text(0, -290, "Point: 0", {
        fontSize: 25,
        color: "#000",
      }),
      this.hero = new Hero(0, 200),
    );

    this.onWindow("touchstart", (event: TouchEvent) => {
      if (event.touches[0].clientX < window.innerWidth / 2) {
        this.hero.moveLeft();
      } else this.hero.moveRight();
    });

    this.onWindow("touchmove", (event: TouchEvent) => {
      if (event.touches[0].clientX < window.innerWidth / 2) {
        this.hero.moveLeft();
      } else this.hero.moveRight();
    });

    this.onWindow("touchend", () => this.hero.stop());

    this.onWindow("keydown", (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") this.hero.moveLeft();
      else if (event.key === "ArrowRight") this.hero.moveRight();
    });

    this.onWindow("keyup", (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") this.hero.stopLeft();
      if (event.key === "ArrowRight") this.hero.stopRight();
    });

    this.interval = new Interval(0.1, () => {
      if (this.intervalCount % this.period === 0) this.createPoop();
      if (this.period > 1 && this.intervalCount % 100 === 0) {
        this.period -= 1;
        this.intervalCount = 0;
      }
      this.intervalCount += 1;
    }).appendTo(this);

    this.collisionChecker = new CollisionChecker<Poop>(
      this.hero,
      this.fallingPoops,
      (collidedPoop) => {
        collidedPoop.dropped();
        this.gameOver();
      },
    ).appendTo(this);

    new Sound({ wav: "/assets/start-game.wav" }).play();
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

  private gameOver() {
    this.hero.dead();
    this.interval.delete();
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
          padding: "10px 20px",
          borderRadius: "5px",
          fontSize: "24px",
        },
        click: () => {
          if (this.parent) new Stage().appendTo(this.parent);
          this.delete();
        },
      }),
    );

    new Sound({ wav: "/assets/game-over.wav" }).play();
  }
}
