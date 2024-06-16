import { getSSLHubRpcClient, HubEventType, ClientOptions } from "@farcaster/hub-nodejs";

const hubRpcEndpoint = "c0b0bc.hubs.neynar.com:2283";
const client = getSSLHubRpcClient(hubRpcEndpoint);

// https://github.com/farcasterxyz/protocol/blob/main/docs/SPECIFICATION.md

const MSG_TYPE_LINK = 5;

// hunger level
// energy
// current level
//

const LINK_ENERGY_BONUS = 2;

let energyMap = new Map<number, number>();

client.$.waitForReady(Date.now() + 5000, async (e) => {
    if (e) {
        console.error(`Failed to connect to ${hubRpcEndpoint}:`, e);
        process.exit(1);
    } else {
        console.log(`Connected to ${hubRpcEndpoint}`);

        const subscribeResult = await client.subscribe({
            eventTypes: [HubEventType.MERGE_MESSAGE],
        });

        if (subscribeResult.isOk()) {
            const stream = subscribeResult.value;

            for await (const event of stream) {
                switch (event.mergeMessageBody.message.data.type) {
                    case MSG_TYPE_LINK:
                        const fid = event.mergeMessageBody.message.data.fid;
                        if (energyMap.has(fid)) {
                            let newEnergy = energyMap.get(fid) + LINK_ENERGY_BONUS;
                            energyMap.set(fid, newEnergy);
                        } else {
                            energyMap.set(fid, LINK_ENERGY_BONUS);
                        }
                        console.log(energyMap);
                }
            }
        }
    }

    client.close();
});
