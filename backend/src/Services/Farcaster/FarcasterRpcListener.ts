import { HubEventType, HubRpcClient, getInsecureHubRpcClient, getSSLHubRpcClient } from "@farcaster/hub-nodejs";
import { ILoggerService, LoggerServiceSymbol } from "../Logging/ILoggerService";
import { inject, injectable } from "inversify";
import { FarcastMessageTypes } from "../../Infrastructure/Enums/Farcast/FarcastMessageTypes";
import { EnergyServiceSymbol, IEnergyService } from "../Energy/IEnergyService";
import { FarcastEnergyBonuses } from "../../Infrastructure/Enums/Farcast/FarcastEnergyBonuses";
import { FarcastReactionTypes } from "../../Infrastructure/Enums/Farcast/FarcastReactionTypes";
import { IFarcasterRpcListener } from "./IFarcasterRpcListener";

@injectable()
export class FarcasterRpcListener implements IFarcasterRpcListener {
  private readonly _rpcEndpoint: string;
  private readonly _client: HubRpcClient;

  private readonly _energyService: IEnergyService;
  private readonly _logger: ILoggerService;

  constructor(
    @inject(EnergyServiceSymbol) private energyService: IEnergyService,
    @inject(LoggerServiceSymbol) private loggerService: ILoggerService,
  ) {
    this._rpcEndpoint = process.env.FARCAST_RPC_NODE;
    this._client = getInsecureHubRpcClient(
      this._rpcEndpoint,
      {
        "grpc.max_receive_message_length": 5000000000
      }
    );
    
    this._energyService = energyService;
    this._logger = loggerService;
  }

  public Listen(): void {
    const deadline = Date.now() + 5000;
    this._client.$.waitForReady(deadline, this.OnClientReady.bind(this));
  }

  public Close(): void {
    this._client.close();
    this._logger.Info("Farcaster node client was closed");
  }

  private async OnClientReady(err: Error | undefined): Promise<void> {
    if (err != null) {
      this._logger.Error(err);
      return;
    }
  
    this._logger.Info("Connected to the farcaster node");
  
    const subscription = await this._client.subscribe({
      eventTypes: [HubEventType.MERGE_MESSAGE],
    });
  
    if (subscription.isErr()) {
      this._logger.Error(subscription.error);
      return;
    }
  
    this._logger.Info("Subscribed on the farcaster node");
    const stream = subscription.value;

    for await (const event of stream) {
      this.ProcessEvent(event);
    }
    
    this._logger.Info("Unsubscribed from the farcaster node");
    this.Close();
  }

  private async ProcessEvent(event: any): Promise<void> {
    const fid = event.mergeMessageBody.message.data.fid;

    switch (event.mergeMessageBody.message.data.type) {
      case FarcastMessageTypes.CastAdd:
        this._energyService.AddEnergy(fid, FarcastEnergyBonuses.NewCast)
        break;
      case FarcastMessageTypes.Link:
        this._energyService.AddEnergy(fid, FarcastEnergyBonuses.Link)
        break;
      case FarcastMessageTypes.ReactionAdd:
        if (event.mergeMessageBody.message.data.reactionBody.type == FarcastReactionTypes.Like) {
          this._energyService.AddEnergy(fid, FarcastEnergyBonuses.Like)
          break;
        }
        
        if (event.mergeMessageBody.message.data.reactionBody.type == FarcastReactionTypes.Recast) {
          this._energyService.AddEnergy(fid, FarcastEnergyBonuses.Recast)
          break;
        }

        break;
    }
  }
}
