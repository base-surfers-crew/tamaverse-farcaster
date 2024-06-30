class Params {
  public abi: any;
  public to: string;
  public data: string;
  public value: string;
}

export class TransactionBroadcastDescription {
  public chainId: string;
  public method: string;
  public params: Params
}
