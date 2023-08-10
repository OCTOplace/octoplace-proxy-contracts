import hre, { ethers, network, upgrades } from 'hardhat';
import { getImplementationAddressFromProxy } from '@openzeppelin/upgrades-core';
import fs from 'fs';
import dotenv from 'dotenv';
import { writeAddr } from './util';
dotenv.config();

const addressFile = './contract_addresses/contract_addresses.md';

const verify = async (addr: string, args: any[]) => {
  try {
    await hre.run('verify:verify', {
      address: addr,
      constructorArguments: args,
    });
  } catch (ex: any) {
    if (ex.toString().indexOf('Already Verified') == -1) {
      throw ex;
    }
  }
};

async function main() {
  console.log('Starting deployments');
  const accounts = await hre.ethers.getSigners();
  const deployer = accounts[0];

  const SwapDataProxyAddress = '0xF492E470bC12DeCB4E25473B038f85F673a2cd6A'; //'0x30A98024612BdF61939528a0Dc44C0bABb62b55C';
  const SwapDataV2Fact = await ethers.getContractFactory('SwapData');
  const SwapDataV2Proxy = await upgrades.upgradeProxy(SwapDataProxyAddress, SwapDataV2Fact);
  await SwapDataV2Proxy.deployed();

  console.log('Proxy upgraded');
  console.log('Getting implementation address');

  const SwapDataV2ImpAddr = (await getImplementationAddressFromProxy(
    network.provider,
    SwapDataV2Proxy.address
  )) as string;

  if (fs.existsSync(addressFile)) {
    fs.rmSync(addressFile);
  }
  writeAddr(addressFile, network.name, SwapDataV2Proxy.address, 'SwapData Proxy');
  writeAddr(addressFile, network.name, SwapDataV2ImpAddr, 'SwapData Implementation');

  console.log(SwapDataV2ImpAddr, 'getImplementationAddress');

  await new Promise((f) => setTimeout(f, 60000));

  console.log('Verifying implenmation contract');

  await verify(SwapDataV2ImpAddr, []);
  console.log('All done');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
