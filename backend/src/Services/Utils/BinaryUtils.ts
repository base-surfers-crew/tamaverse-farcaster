export class BinaryUtils {
  public static HexStringToUint8Array(hexstring: string): Uint8Array {
    const matches = hexstring.match(/.{1,2}/g);
  
    if (!matches) {
      throw new Error("Invalid hex string provided");
    }
  
    return new Uint8Array(matches.map((byte: string) => parseInt(byte, 16)));
  }
}
