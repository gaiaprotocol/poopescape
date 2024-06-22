class Env {
  public dev!: boolean;
  public isApp!: boolean;

  public init(options: { dev: boolean; isApp: boolean }) {
    this.dev = options.dev;
    this.isApp = options.isApp;
  }
}

export default new Env();
