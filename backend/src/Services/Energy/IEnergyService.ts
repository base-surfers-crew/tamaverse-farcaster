export interface IEnergyService {
  AddEnergy(fid: number, amount: number): Promise<void>
}

export const EnergyServiceSymbol = "IEnergyService"
