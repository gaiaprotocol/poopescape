import {
  Collidable,
  Collider,
  ColliderType,
  EllipseNode,
  GaiaEngineConfig,
  Movable,
  SFXPlayer,
  Sprite,
  StateSet,
} from "@gaiaengine/2d";
import { IntegerUtils } from "../../../ts-module/lib/index.js";

export default class Poop extends Movable implements Collidable {
  public colliders: Collider[] = [{
    type: ColliderType.Ellipse,
    x: 0,
    y: 0,
    width: 40,
    height: 40,
  }];

  private stateSet;

  constructor(x: number, y: number) {
    super(x, y);

    this.accelY = 1000;

    this.stateSet = new StateSet(this, {
      falling: new Sprite(0, 0, "/assets/poop/poop.png"),
      dropped: new Sprite(0, 0, "/assets/poop/dropped.png"),
    }, "falling");

    if (GaiaEngineConfig.isDevMode) {
      this.append(
        new EllipseNode(0, 0, 40, 40, undefined, { width: 2, color: 0xff0000 }),
      );
    }
  }

  public changeStateToDropped() {
    this.stateSet.state = "dropped";
    SFXPlayer.play(`assets/poop/drop${IntegerUtils.random(1, 3)}.wav`);
  }

  public drop() {
    this.speedY = 0;
    this.accelY = 0;
    this.changeStateToDropped();
    return this;
  }
}
