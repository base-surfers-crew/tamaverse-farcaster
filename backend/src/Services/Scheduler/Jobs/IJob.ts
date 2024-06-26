export interface IJob {
  executeAsync(): Promise<void>;
}
