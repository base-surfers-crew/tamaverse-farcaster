import { getSSLHubRpcClient, HubEventType } from "@farcaster/hub-nodejs";

const hubRpcEndpoint = "c0b0bc.hubs.neynar.com:2283";
const client = getSSLHubRpcClient(hubRpcEndpoint);

// https://github.com/farcasterxyz/protocol/blob/main/docs/SPECIFICATION.md#types
const MESSAGE_TYPE_CAST_ADD = 1;
const MESSAGE_TYPE_REACTION_ADD = 3;
const MESSAGE_TYPE_LINK = 5;

// https://github.com/farcasterxyz/protocol/blob/main/docs/SPECIFICATION.md#14-reactions
const REACTION_TYPE_LIKE = 1; // Like the target cast
const REACTION_TYPE_RECAST = 2; // Share target cast to the user's audience

// hunger level
// energy
// current level

const LINK_ENERGY_BONUS = 2;
const NEW_CAST_ENERGY_BONUS = 10;
const RECAST_ENERGY_BONUS = 5;
const LIKE_CAST_ENERGY_BONUS = 1;

let energyMap = new Map<number, number>();

function increaseEnergy(fid: number, energy: number) {
    console.log(`Adding ${energy} energy to user ${fid}`);

    if (energyMap.has(fid)) {
        let newEnergy = energyMap.get(fid) + energy;
        energyMap.set(fid, newEnergy);
    } else {
        energyMap.set(fid, energy);
    }
}

client.$.waitForReady(Date.now() + 5000, async (e) => {
    if (e) {
        console.error(`Failed to connect to ${hubRpcEndpoint}:`, e);
        process.exit(1);
    } else {
        console.log(`Connected to ${hubRpcEndpoint}`);

        while (true) {
            try {
                const subscribeResult = await client.subscribe({
                    eventTypes: [HubEventType.MERGE_MESSAGE],
                });

                if (subscribeResult.isOk()) {
                    console.log('subscribed');

                    const stream = subscribeResult.value;
                    for await (const event of stream) {
                        const fid = event.mergeMessageBody.message.data.fid;

                        switch (event.mergeMessageBody.message.data.type) {
                            // This also includes actions "Comment Cast"
                            case MESSAGE_TYPE_CAST_ADD:
                                increaseEnergy(fid, NEW_CAST_ENERGY_BONUS);
                                break;
                            case MESSAGE_TYPE_LINK:
                                increaseEnergy(fid, LINK_ENERGY_BONUS);
                                break;
                            case MESSAGE_TYPE_REACTION_ADD:
                                if (event.mergeMessageBody.message.data.reactionBody.type == REACTION_TYPE_LIKE) {
                                    increaseEnergy(fid, LIKE_CAST_ENERGY_BONUS);
                                } else if (event.mergeMessageBody.message.data.reactionBody.type == REACTION_TYPE_RECAST) {
                                    increaseEnergy(fid, RECAST_ENERGY_BONUS);
                                }
                                break;
                        }
                    }
                }
            } catch (e) {
                console.log(`got error ${e}`);
            }
        }
    }

    client.close();
});
