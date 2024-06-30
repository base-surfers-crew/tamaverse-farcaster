import { controller, httpPost, requestBody } from 'inversify-express-utils';
import { inject } from 'inversify';
import { BaseController } from './BaseController';
import { Prefix } from './Prefix';
import { BlockchainServiceSymbol, IBlockchainService } from '../Services/Blockchain/IBlockchainService';
import { SignaturePacket } from '../Infrastructure/DTOs/Farcaster/SignaturePacket';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from '../Infrastructure/Exceptions/ValidationException';

@controller(`${Prefix}/pets`)
export class PetsController extends BaseController {
  private readonly _blockchainService: IBlockchainService;

  constructor(@inject(BlockchainServiceSymbol) private blockchainService: IBlockchainService) {
    super();

    this._blockchainService = blockchainService;
  }

  @httpPost('/mint')
  public async MintPet(@requestBody() body: Object): Promise<void> {
    const request = plainToClass(SignaturePacket, body);
    const errors = await validate(request);

    if (errors.length !== 0) {
      throw new ValidationException(errors);
    }

    await this._blockchainService.Mint(request);
  }
}
