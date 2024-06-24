import { Dictionary, MapOptions, ModelIdentifier } from '@automapper/core';

export interface IMapper {
  Map<TSource extends Dictionary<TSource>, TDestination extends Dictionary<TDestination>>(
    sourceObject: TSource,
    sourceIdentifier: ModelIdentifier<TSource>,
    destinationIdentifier: ModelIdentifier<TDestination>,
    options?: MapOptions<TSource, TDestination>
  ): TDestination;

  MapArray<TSource extends Dictionary<TSource>, TDestination extends Dictionary<TDestination>>(
    sourceArray: TSource[],
    sourceIdentifier: ModelIdentifier<TSource>,
    destinationIdentifier: ModelIdentifier<TDestination>,
    options?: MapOptions<TSource[], TDestination[]>
  ): TDestination[];
}

export const MapperSymbol = 'IMapper';
