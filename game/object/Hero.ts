import { Image, Movable, Sprite, StateSet } from "@gaiaengine/gaiaengine";

export default class Hero extends Movable {
  private stateSet: StateSet;
  private speed = 300;

  constructor(x: number, y: number) {
    super(x, y);
    this.minX = -180;
    this.maxX = 180;

    this.stateSet = new StateSet(this, {
      idle: new Image("assets/hero/idle.png"),
      run: new Sprite("assets/hero/run.png", 6, 10),
      dead: new Image("assets/hero/dead.png"),
    }, "idle");
  }

  public moveLeft() {
    this.scaleX = -1;
    this.speedX = -this.speed;
    this.stateSet.state = "run";
  }

  public moveRight() {
    this.scaleX = 1;
    this.speedX = this.speed;
    this.stateSet.state = "run";
  }

  public stop() {
    this.speedX = 0;
    this.stateSet.state = "idle";
  }

  public stopLeft() {
    if (this.speedX < 0) this.stop();
  }

  public stopRight() {
    if (this.speedX > 0) this.stop();
  }
}
