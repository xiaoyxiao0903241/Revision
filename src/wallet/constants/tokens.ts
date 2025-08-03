import { bscTestnet } from 'viem/chains';

// DEX 合约地址
// export const DEX_ADDRESS = '0x10ED43C718714eb63d5aA57B78B54704E256024E' // PancakeSwap Router
// export const DEX_ADDRESS = "0xD99D1c33F9fC3444f8101754aBC46c52416550D1"; // PancakeSwap Router
// export const PREMIT_ADDRESS = "0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768";
// 为什么需要授权给0x31c2f6fcff4f8759b3bd5bf0e1084a055615c768

// PancakeSwap Router ABI
export const PANCAKESWAP_ROUTER_ABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amountOutMin',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: 'path',
        type: 'address[]',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'swapExactTokensForTokensSupportingFeeOnTransferTokens',
    outputs: [
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amountOutMin',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: 'path',
        type: 'address[]',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'swapExactTokensForTokens',
    outputs: [
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: 'path',
        type: 'address[]',
      },
    ],
    name: 'getAmountsOut',
    outputs: [
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

//token
export const DAI = '0x5A1502b5b99634D5Fd160f6686da5336c747FC8D';
export const OLY = '0x3c80997550533Af5E4B827DE15B40DD28585ab75'; //0x6A92B1E99De09f71CD96BC91F934826d96B8b26E
export const sOLY = '0xd428a9De40f876dA869656de02fA18b884cDA373';
export const DAIAS = '0x13bd90982862b734DcaCfBce0daD11ea1903fB80';
export const DEX_ADDRESS = '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff';

//矩阵
export const matrixNetwork = '0x95c371e42896DCaE778C825B9ceb72b1Df3Fe28d';

//节点销售
export const nodeSales = '0x864EC402AAa01c236B5756f3b81ADF3c45beDE32';

//质押
export const nodeStaking = '0xb7bebC6a4aBe4939450b5E3899fe593C1dA7d384';
export const demandStaking = '0x487a390e9B98DD26EB542d9a7a5d6427e1ef177D';
export const longStaking30 = '0xD1f8c0A7EAC272f6e4a5f5d34Cb5B4d57e9f4951';
export const longStaking60 = '0xC2b5E282b68c2d68B5394Cc59D6D1b7DA965a86b';
export const longStaking90 = '0x9e6D278751151555783FC06478E5A9Da1B1A1cA1';
export const longStaking180 = '0x81f47797D6dEe2e49F4b79B85832f3cDFc760966';
export const longStaking360 = '0x56bd5Cb0DC3BE7798F2eB230487e76Cbc3163843';

//债券
export const stableBond5 = '0x46eD1c1160E2c10fe84b59E3778EAEfd6204967d';
export const stableBond30 = '0xAAbf87D0c1e90b52c6f78DB7134c4e08Ab9496E0';
export const stableBond90 = '0x6a9a33A0de13E854C2D9fBCe3D05230DA303C225';
export const stableBond180 = '0x83cc0390965B3F94FBe36a37Af1AeAc858814DaF';
export const stableBond360 = '0x69A99C175D9A442354762A41F8EF879c2C037DF2';

export const liquidityBond5 = '0x9e1DA4051b16F6Ffa33b5dD15a0A6b7fEB015Ee0';
export const liquidityBond30 = '0xD236614cD3C20CA5b4b49e9c5dbbe5C4459f453E';
export const liquidityBond90 = '0x3719c24bC44d562Ca64b37D8c09d4c5238d036c3';
export const liquidityBond180 = '0xE2463E5d8d560B207874d2A3F9b0463532FFcC0D';
export const liquidityBond360 = '0x2f5928F291073D22b2428559E9FE980460432ACD';

export const destroyBond5 = '0x464A97bFc9311EAb9Bb28cC6cD9594D8A33E579f';
export const destroyBond30 = '0x48D351E8Ee62e2209d642b6A9d5e4Cb915633fC7';

export const lpHelper = '0x750F85E60eAa4B708A75A7Bd87C8776670Ef2C01';
export const olympusBondingCalculator =
  '0xd1E50053D43930D50F1bd568c657d17D96E930aD';

export const staking = '0x366ee0FdF39B3486FC5437b7eF2a2f792E5b87F1';
export const distributor = '0xE31Ac1c7931542e2e7A97E55891250d3c9B6438D';
export const treasury = '0x8F3e7FE1692a53aCD4905480f1bA601C2E9982F0';
export const yieldLocker = '0x250119EDf91443c6709cF769DD6eC311a0bb2eBF';
export const turbine = '0x5C4964867955d345eD6B9C75F540E695262f374C';
export const taxReceiver = '0x4c79CB009D4d3498CAA13832B6dCF949310B3cd4';
export const dao = '0xe89719613Cef085fd6Ba8C3ac6441C5F4DDFdb1F';

//收益
export const ReferralRewardPool = '0x4105DCA6aE40308c94D05b9560c1119daa814dE3';
export const TitleRewardPool = '0x888378c97ea3Ad04F5dCD104bbf676dae648483C';
export const ReverseRewardPool = '0x09724aE039aD5419B0d0D7Fee6654055F504b9ef';
export const ServiceRewardPool = '0xc7A0EF70e26ac82c6fCa5262d6723448f9FA1296';
export const LeadRewardPool = '0x59390F807a471A845A2df0C9eF17117553DBBbcA';

// 代币合约地址
export const TOKEN_ADDRESSES = {
  OLY: OLY,
  DAI: DAI,
} as const;

export const chainId = bscTestnet.id;
export const blocks = 1.5;
