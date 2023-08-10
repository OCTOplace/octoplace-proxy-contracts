import hre, { ethers, upgrades, network } from 'hardhat';
import { getContractAddress } from '@ethersproject/address';
import fs from 'fs';
import { getImplementationAddressFromProxy } from '@openzeppelin/upgrades-core';
import dotenv from 'dotenv';
import { verify, writeAddr } from './util';
dotenv.config();

const addressFile = './contract_addresses/contract_addresses.md';

async function main() {
  console.log('Starting deployments');
  const accounts = await hre.ethers.getSigners();
  const deployer = accounts[0];

  const transactionCount = deployer.getTransactionCount();
  const futureSwapNFTAddress = getContractAddress({
    from: deployer.address,
    nonce: transactionCount + 1
  });

  const SwapDataFactory = await ethers.getContractFactory('SwapData');
  const SwapDataProxy = await upgrades.deployProxy(SwapDataFactory, [deployer.address, futureSwapNFTAddress], {
    initializer: 'initialize',
    kind: 'transparent',
  });
  await SwapDataProxy.deployed();
  const SwapDataImpAddr = (await getImplementationAddressFromProxy(network.provider, SwapDataProxy.address)) as string;
  if (fs.existsSync(addressFile)) {
    fs.rmSync(addressFile);
  }

  console.log('Swap Data Proxy address: ', SwapDataProxy.address);
  console.log('Swap Data Implementation address: ', SwapDataImpAddr);

  const SwapNFTFactory = await ethers.getContractFactory('SwapNFT');
  const SwapNFTProxy = await upgrades.deployProxy(SwapNFTFactory, [deployer.address, SwapDataProxy.address], {
    initializer: 'initialize',
    kind: 'transparent',
  });
  await SwapNFTProxy.deployed();
  const SwapNFTImpAddr = (await getImplementationAddressFromProxy(network.provider, SwapNFTProxy.address)) as string;
  if (fs.existsSync(addressFile)) {
    fs.rmSync(addressFile);
  }

  console.log('Swap NFT Proxy address: ', SwapNFTProxy.address);
  console.log('Swap NFT Implementation address: ', SwapNFTImpAddr);

  const NFTContractListingFactory = await ethers.getContractFactory('NFTContractListing');
  const NFTContractListingProxy = await upgrades.deployProxy(NFTContractListingFactory, [], {
    initializer: 'initialize',
    kind: 'transparent',
  });
  await NFTContractListingProxy.deployed();
  const NFTContractListingImpAddr = (await getImplementationAddressFromProxy(
    network.provider,
    NFTContractListingProxy.address
  )) as string;
  if (fs.existsSync(addressFile)) {
    fs.rmSync(addressFile);
  }

  console.log('Listing Proxy address: ', NFTContractListingProxy.address);
  console.log('Listing Implementation address: ', NFTContractListingImpAddr);

  writeAddr(addressFile, network.name, SwapDataProxy.address, 'SwapData Proxy');
  writeAddr(addressFile, network.name, SwapDataImpAddr, 'SwapData Implementation');
  writeAddr(addressFile, network.name, SwapNFTProxy.address, 'SwapNFT Proxy');
  writeAddr(addressFile, network.name, SwapNFTImpAddr, 'SwapNFT Implementation');
  writeAddr(addressFile, network.name, NFTContractListingProxy.address, 'NFTContractListing Proxy');
  writeAddr(addressFile, network.name, NFTContractListingImpAddr, 'NFTContractListing Implementation');

  await new Promise((f) => setTimeout(f, 60000));

  console.log('Verifying implenmation contract');

  await verify(SwapDataImpAddr, []);
  await verify(SwapNFTImpAddr, []);
  await verify(NFTContractListingImpAddr, []);
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
