import { Background, Dom, Node, Text } from "@gaiaengine/gaiaengine";
import Stage from "./Stage.js";

export default class Main extends Node {
  constructor() {
    super(0, 0);
    this.append(
      new Background("assets/background.png", { scrollSpeedX: -100 }),
      new Text(0, -200, "Poop Escape", { fontSize: 48, color: "white" }),
      new Text(0, -120, "Made with Gaia Engine", {
        fontSize: 24,
        color: "white",
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
  }
}
