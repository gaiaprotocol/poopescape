import { IntegerUtil } from "@common-module/app";
import { ColliderType, Image, Movable, StateSet } from "@gaiaengine/gaiaengine";

export default class Poop extends Movable {
  private stateSet: StateSet;

  constructor(onDropped: () => void) {
    super(IntegerUtil.random(-180, 180), -320);
    this.accelY = 1000;
    this.maxY = 235;

    this.addCollider({
      type: ColliderType.Rect,
      x: 0,
      y: 0,
      width: 40,
      height: 40,
    });

    this.stateSet = new StateSet(this, {
      falling: new Image(0, 0, "assets/poop/poop.png"),
      dropped: new Image(0, 0, "assets/poop/dropped.png"),
    }, "falling");

    this.onMaxYReached = () => {
      this.dropped();
      onDropped();
    };
  }

  public dropped() {
    this.stateSet.state = "dropped";
  }
}
