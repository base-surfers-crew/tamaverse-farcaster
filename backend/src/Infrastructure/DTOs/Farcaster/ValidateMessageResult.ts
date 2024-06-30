class Message {
  public data: MessageData;
  public hash: string;
  public hashScheme: string;
  public signature: string;
  public signatureScheme: string;
  public signer: string;
}

class MessageData {
  public type: string;
  public fid: number;
  public timestamp: number;
  public network: string;
  public frameActionBody: FrameActionBody;
}

class FrameActionBody {
  public url: string;
  public buttonIndex: number;
  public inputText: string;
}

export class ValidateMessageResult {
  public valid: boolean;
  public message: Message;
}
