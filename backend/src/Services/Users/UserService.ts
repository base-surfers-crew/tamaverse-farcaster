import { inject, injectable } from "inversify";
import { UserDescriptionResponse } from "../../Infrastructure/DTOs/Users/Responses/UserDescriptionResponse";
import { IUserService } from "./IUserService";
import { DbContextSymbol, IDbContext } from "../../Persistence/IDbContext";
import { IMapper, MapperSymbol } from "../../Infrastructure/Mapper/IMapper";
import { NotFoundException } from "../../Infrastructure/Exceptions/NotFoundException";
import { User } from "../../Persistence/Entities/User";

@injectable()
export class UserService implements IUserService {
  private readonly _dbContext: IDbContext;
  private readonly _mapper: IMapper;

  constructor(
    @inject(DbContextSymbol) private dbContext: IDbContext,
    @inject(MapperSymbol) private mapper: IMapper
  ) {
    this._dbContext = dbContext;
    this._mapper = mapper;
  }

  public async GetUserById(userId: number): Promise<UserDescriptionResponse> {
    const user = await this._dbContext.Users.findOne({ Id: userId });
    if (user == null) {
      throw new NotFoundException("User was not found");
    }

    return this._mapper.Map(user, User, UserDescriptionResponse);
  }
}