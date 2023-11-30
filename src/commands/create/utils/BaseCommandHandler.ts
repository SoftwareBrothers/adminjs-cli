export abstract class BaseCommandHandler<T> {
  protected options: T;

  constructor(options: T) {
    this.options = options;
  }

  public abstract run(): Promise<void>;
}
