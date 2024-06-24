export abstract class JwtPayload {
  public UserId: number;

  public FarcasterId: number;

  public jti: string;

  public iat: number;

  public exp: number;

  public aud: string;

  public iss: string;

  constructor(id: number, fid: number) {
    this.UserId = id;
    this.FarcasterId = fid;
  }
}
