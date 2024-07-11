import {
  Button,
  ButtonType,
  el,
  MaterialIcon,
  Popup,
  Store,
} from "@common-module/app";

export default class SettingsPopup extends Popup {
  private removeAdsStore = new Store("removeAds");

  constructor() {
    super(".settings-popup", { barrierDismissible: true });
    this.header.append(
      el("h1", "Settings"),
      new Button({
        tag: ".close",
        type: ButtonType.Circle,
        icon: new MaterialIcon("close"),
        click: () => this.delete(),
      }),
    );

    this.main.append(
      new Button({
        type: ButtonType.Contained,
        icon: new MaterialIcon("share"),
        title: "Share App",
        click: () => {
          if ((window as any).messageHandler) {
            (window as any).messageHandler.postMessage(
              JSON.stringify({ method: "shareApp" }),
            );
          }
        },
      }),
      new Button({
        disabled: this.removeAdsStore.get("removed"),
        type: ButtonType.Contained,
        icon: new MaterialIcon("star"),
        title: "Remove Ads",
        click: () => {
          if ((window as any).messageHandler) {
            (window as any).messageHandler.postMessage(
              JSON.stringify({ method: "removeAds" }),
            );
          }
          this.delete();
        },
      }),
      new Button({
        disabled: this.removeAdsStore.get("removed"),
        type: ButtonType.Contained,
        icon: new MaterialIcon("restore"),
        title: "Restore Purchases",
        click: () => {
          if ((window as any).messageHandler) {
            (window as any).messageHandler.postMessage(
              JSON.stringify({ method: "restorePurchases" }),
            );
          }
          this.delete();
        },
      }),
    );

    this.footer.append(
      new Button({
        tag: ".close",
        title: "Close",
        click: () => this.delete(),
      }),
    );
  }
}
