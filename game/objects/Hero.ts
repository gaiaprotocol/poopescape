import {
  AnimatedSprite,
  Collidable,
  Collider,
  ColliderType,
  GaiaEngineConfig,
  Movable,
  RectangleNode,
  Sprite,
  StateSet,
} from "@gaiaengine/2d";

export default class Hero extends Movable implements Collidable {
  public colliders: Collider[] = [{
    type: ColliderType.Rectangle,
    x: 0,
    y: 0,
    width: 20,
    height: 90,
  }];

  private stateSet;
  private speed = 300;

  constructor(x: number, y: number) {
    super(x, y);

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

    if (GaiaEngineConfig.isDevMode) {
      this.append(
        new RectangleNode(0, 0, 20, 90, undefined, {
          width: 2,
          color: 0xff0000,
        }),
      );
    }
  }

  public die() {
    this.stateSet.state = "dead";
    this.stopMoving();
  }

  private get isDead() {
    return this.stateSet.state === "dead";
  }

  private clearAccel() {
    this.accelX = 0;
    this.minSpeedX = -Infinity;
    this.maxSpeedX = Infinity;
  }

  public moveLeft() {
    if (!this.isDead) {
      this.clearAccel();
      this.scaleX = -1;
      this.speedX = -this.speed;
      this.stateSet.state = "run";
    }
  }

  public moveRight() {
    if (!this.isDead) {
      this.clearAccel();
      this.scaleX = 1;
      this.speedX = this.speed;
      this.stateSet.state = "run";
    }
  }

  public stopMovingLeft() {
    if (this.speedX < 0) {
      this.accelX = 1000;
      this.maxSpeedX = 0;
      if (!this.isDead) this.stateSet.state = "idle";
    }
  }

  public stopMovingRight() {
    if (this.speedX > 0) {
      this.accelX = -1000;
      this.minSpeedX = 0;
      if (!this.isDead) this.stateSet.state = "idle";
    }
  }

  public stopMoving() {
    if (this.speedX < 0) this.stopMovingLeft();
    else if (this.speedX > 0) this.stopMovingRight();
  }
}
