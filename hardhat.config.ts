require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades');
import '@nomiclabs/hardhat-waffle';
import 'hardhat-gas-reporter';
import 'hardhat-contract-sizer';
import dotenv from 'dotenv';
dotenv.config();
const { chainConfig } = require('@nomiclabs/hardhat-etherscan/dist/src/ChainConfig');
chainConfig['pulseTestnet'] = {
  chainId: 943,
  urls: {
    apiURL: 'https://scan.v4.testnet.pulsechain.com/api',
    browserURL: 'https://scan.v4.testnet.pulsechain.com',
  },
};

chainConfig['pulse'] = {
  chainId: 369,
  urls: {
    apiURL: 'https://scan.pulsechain.com/api',
    broswerURL: 'https://scan.pulsechain.com',
  },
};

// infuraId
const infuraId = process.env.INFURA_ID;
const privateKey = process.env.PRIVATE_KEY;
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 5,
      },
    },
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      forking: {
        // url: 'https://alpha-weathered-card.bsc.quiknode.pro/5ee1c5dc4700fd50e42762ca281bf35b7dc36b88',
        url: 'https://newest-falling-layer.bsc-testnet.quiknode.pro/97d2bad70da983db0c16ab40774d882c718e4e10',
        // blockNumber: 28472454,
      },
    },
    ethereum: {
      url: 'https://eth-mainnet.g.alchemy.com/v2/x-c9yoHrF6WE7jUsr_hs50lxMgnkXqyV',
      accounts: [privateKey],
      network_id: 1,
    },
    bsc: {
      url: 'https://bsc-dataseed2.binance.org',
      accounts: [privateKey],
      network_id: 56,
      gasLimit: 55000000000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    bnbt: {
      url: `https://newest-falling-layer.bsc-testnet.quiknode.pro/97d2bad70da983db0c16ab40774d882c718e4e10`,
      accounts: [privateKey],
      network_id: 97,
      gasPrice: 30000000000,
      gas: 5000000,
      confirmations: 2,
      timeoutBlocks: 30,
      skipDryRun: true,
    },
    goerli: {
      // url: `https://eth-goerli.g.alchemy.com/v2/axk_8yCPO5yxqRKEY3XVVVd8U43dEKPg`,
      url: 'https://eth-goerli.public.blastapi.io',
      accounts: [privateKey],
      network_id: 5,
      confirmations: 5,
    },
    mumbai: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/ClBDi0Fl2uLmH2dkE7ANrMu2yYZmQaCo',
      accounts: [privateKey],
      network_id: 80001,
      confirmations: 5,
    },
    pulseTestnet: {
      url: 'https://rpc.v4.testnet.pulsechain.com',
      accounts: [privateKey],
      network_id: 943,
      gasPrice: 50000000000,
      gasLimit: 50000000,
      confirmations: 5,
      timeoutBlocks: 30,
      skipDryRun: true,
    },
    pulse: {
      url: 'https://rpc.pls.pulsefusion.io/LfhyA4xeTyu8Re2jek6CdP5D',
      // url: 'https://rpc.pulsechain.com',
      accounts: [privateKey],
      network_id: 369,
      gasPrice: 1500000000000000,
      // gasLimit: 50000000,
      // confirmations: 5,
      // timeoutBlocks: 30,
      // skipDryRun: true,
    },
  },
  etherscan: {
    apiKey: {
      bsc: '2DDSXSQDUBTEQ8NJVRBB3XRAPMVTWP4U1T',
      bscTestnet: '2DDSXSQDUBTEQ8NJVRBB3XRAPMVTWP4U1T',
      goerli: 'D7VHJ687GHKP79N8I2FGTE6NX9Q8P1F8YI',
      polygonMumbai: 'BG2T1G84PT4PY69X79H5WFEVAJ239957ZI',
      pulseTestnet: '0',
      pulse: '0',
      mainnet: 'VERKPGM6FHAHUQ1TGAH1XYQHEXF4Y1NMES',
    },
  },
};
