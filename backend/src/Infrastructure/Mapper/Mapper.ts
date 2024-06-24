import {
  Dictionary,
  Mapper as AutoMapper,
  MapOptions,
  ModelIdentifier,
  createMapper,
  createMap,
  forMember,
  mapFrom,
} from '@automapper/core';
import { classes } from '@automapper/classes';
import { injectable } from 'inversify';
import { IMapper } from './IMapper';
import { User } from '../../Persistence/Entities/User';
import { UserDescriptionResponse } from '../DTOs/Users/Responses/UserDescriptionResponse';
import { EnergyUtil } from '../../Services/Utils/EnergyUtil';
import { ExperienceUtil } from '../../Services/Utils/ExperienceUtil';

@injectable()
export class Mapper implements IMapper {
  private readonly _mapper: AutoMapper;

  constructor() {
    this._mapper = createMapper({
      strategyInitializer: classes(),
    });

    this.InitializeMaps();
  }

  public Map<TSource extends Dictionary<TSource>, TDestination extends Dictionary<TDestination>>(
    sourceObject: TSource,
    sourceIdentifier: ModelIdentifier<TSource>,
    destinationIdentifier: ModelIdentifier<TDestination>,
    options?: MapOptions<TSource, TDestination>,
  ): TDestination {
    return this._mapper.map(sourceObject, sourceIdentifier, destinationIdentifier, options);
  }

  public MapArray<TSource extends Dictionary<TSource>, TDestination extends Dictionary<TDestination>>(
    sourceArray: TSource[],
    sourceIdentifier: ModelIdentifier<TSource>,
    destinationIdentifier: ModelIdentifier<TDestination>,
    options?: MapOptions<TSource[], TDestination[]>,
  ): TDestination[] {
    return this._mapper.mapArray(sourceArray, sourceIdentifier, destinationIdentifier, options);
  }

  private InitializeMaps(): void {
    createMap(
      this._mapper,
      User,
      UserDescriptionResponse,
      forMember(
        x => x.CurrentEnergy,
        mapFrom(x => x.Eneregy)
      ),
      forMember(
        x => x.AccumulatedEnergyForToday,
        mapFrom(x => x.AccumulatedEnergy)
      ),
      forMember(
        x => x.MaxEnergyForToday,
        mapFrom(x => EnergyUtil.CalcMaxEnergy(x.Level))
      ),
      forMember(
        x => x.CurrentExperience,
        mapFrom(x => x.Experience)
      ),
      forMember(
        x => x.ExperienceRequiredForLevelUp,
        mapFrom(x => ExperienceUtil.RequiredForLevelUp(x.Level))
      ),
    )
  }
}
