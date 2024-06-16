import { IntegerUtil, Sound } from "@common-module/app";
import { ColliderType, Image, Movable, StateSet } from "@gaiaengine/2d";

export default class Poop extends Movable {
  private stateSet: StateSet;

  constructor(onDroppedToGround: () => void) {
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
      falling: new Image(0, 0, "/assets/poop/poop.png"),
      dropped: new Image(0, 0, "/assets/poop/dropped.png"),
    }, "falling");

    this.onMaxYReached = () => {
      this.dropped();
      onDroppedToGround();
    };
  }

  public dropped() {
    new Sound({ wav: `assets/poop/drop${IntegerUtil.random(1, 3)}.wav` })
      .play();
    this.stateSet.state = "dropped";
  }
}
