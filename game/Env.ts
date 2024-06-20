class Env {
  public dev!: boolean;

  public init(options: { dev: boolean }) {
    this.dev = options.dev;
  }
}

export default new Env();
