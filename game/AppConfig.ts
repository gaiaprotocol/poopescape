import { GaiaEngineConfig } from "@gaiaengine/2d";

export interface IAppConfig {
  isDevMove: boolean;
  isRunningInApp: boolean;
}

class AppConfig implements IAppConfig {
  public isDevMove!: boolean;
  public isRunningInApp!: boolean;

  public init(config: IAppConfig) {
    Object.assign(this, config);

    GaiaEngineConfig.isDevMode = config.isDevMove;
  }
}

export default new AppConfig();
