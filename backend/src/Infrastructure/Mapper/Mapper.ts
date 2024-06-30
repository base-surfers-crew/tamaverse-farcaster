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
  }
}
