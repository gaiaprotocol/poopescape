import { Background, WindowEventNode } from "@gaiaengine/gaiaengine";
import Hero from "../object/Hero.js";

export default class Stage extends WindowEventNode {
  private hero: Hero;

  constructor() {
    super(0, 0);

    this.append(
      new Background("assets/background.png"),
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
  }
}
