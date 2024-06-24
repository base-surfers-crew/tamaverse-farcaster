import hre from "hardhat";
export async function verifyContract(address: string, ...constructorArguments: any) {
    console.log('Wait a minute for changes to propagate to Etherscan\'s backend...');
    console.log('Verifying contract...');
    await hre.run('verify:verify', {
        address,
        constructorArguments: [...constructorArguments],
    });
    console.log('Contract verified on Etherscan');
}


verifyContract('0x407571da01B30EC5C9B1e21936f9EF882fF34b40')
