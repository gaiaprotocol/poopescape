import {
  AnimatedSprite,
  ColliderType,
  Movable,
  Sprite,
  StateSet,
} from "@gaiaengine/2d";

export default class Hero extends Movable {
  private stateSet: StateSet;
  private speed = 300;

  constructor(x: number, y: number) {
    super(x, y);
    this.minX = -180;
    this.maxX = 180;

    this.addCollider({
      type: ColliderType.Rect,
      x: 0,
      y: 0,
      width: 20,
      height: 90,
    });

    this.stateSet = new StateSet(this, {
      idle: new Sprite(0, 0, "/assets/hero/idle.png"),
      run: new AnimatedSprite(
        0,
        0,
        "/assets/hero/run.png",
        {
          frames: {
            run1: {
              frame: { x: 0, y: 0, w: 48, h: 93 },
            },
            run2: {
              frame: { x: 48, y: 0, w: 48, h: 93 },
            },
            run3: {
              frame: { x: 96, y: 0, w: 48, h: 93 },
            },
            run4: {
              frame: { x: 144, y: 0, w: 48, h: 93 },
            },
            run5: {
              frame: { x: 192, y: 0, w: 48, h: 93 },
            },
            run6: {
              frame: { x: 240, y: 0, w: 48, h: 93 },
            },
          },
          meta: { scale: 1 },
          animations: {
            run: ["run1", "run2", "run3", "run4", "run5", "run6"],
          },
        },
        "run",
        10,
      ),
      dead: new Sprite(0, 40, "/assets/hero/dead.png"),
    }, "idle");
  }

  private get isDead() {
    return this.stateSet.state === "dead";
  }

  public moveLeft() {
    if (this.isDead) return;
    this.scaleX = -1;
    this.speedX = -this.speed;
    this.stateSet.state = "run";
  }

  public moveRight() {
    if (this.isDead) return;
    this.scaleX = 1;
    this.speedX = this.speed;
    this.stateSet.state = "run";
  }

  public stop() {
    if (this.speedX < 0) this.stopLeft();
    else if (this.speedX > 0) this.stopRight();
  }

  public stopLeft() {
    if (this.speedX < 0) {
      this.accelX = 1000;
      this.toSpeedX = 0;
      if (!this.isDead) this.stateSet.state = "idle";
    }
  }

  public stopRight() {
    if (this.speedX > 0) {
      this.accelX = -1000;
      this.toSpeedX = 0;
      if (!this.isDead) this.stateSet.state = "idle";
    }
  }

  public dead() {
    this.stateSet.state = "dead";
    this.stop();
  }
}
