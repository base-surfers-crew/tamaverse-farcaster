export interface IFarcasterRpcListener {
  Listen(): void;
  Close(): void;
}

export const FacrasterRpcListenerSymbol = "IFarcasterRpcListener";