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
export const DAI = '0x55d398326f99059fF775485246999027B3197955'; //我是正式的
export const OLY = '0x544028231562a43b106FbceCA722B65Cb5C861b0';
export const sOLY = '0x870FD2D756D04C382508FCC2F0e98C78e6e2BF07';
export const DAIAS = '0x6865704FF097b1105Ed42B8517020e14Fe9A2ABD';
export const DEX_ADDRESS = '0x10ED43C718714eb63d5aA57B78B54704E256024E';

//矩阵
export const matrixNetwork = '0x7AD2e543270A46A0F6dAC28999418Ea1942d8aD4';

//节点销售
export const nodeSales = '0xe7ff403381113245C8daB9a31b3DBF343554E5A2';

//质押
export const nodeStaking = '0x3DBF36cf77Ee46a697Acc377Fed2526Dad3Ca308';
export const demandStaking = '0xFAB5dC8EAEDCB9e11f767eC13B76B8672b0e20db';
export const longStaking5 = '0xF89Ba49FCa3a37A7F5a2f1f2793B335f3FAAF124';
// export const longStaking60 = '0xC2b5E282b68c2d68B5394Cc59D6D1b7DA965a86b';
// export const longStaking90 = '0x9e6D278751151555783FC06478E5A9Da1B1A1cA1';
export const longStaking180 = '0x77c5A6412074D5ba8766124caBB6ea543651619C';
export const longStaking360 = '0xE72b644d8d5b62d08787167C45d1BbC124937C1C';
export const MappingStaking = '0x832dfdFEBC6EB520A7251Bc2470923f6031C5867'; //兑换的

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
  '0xD3BD832c29330d18a4b0C7eFDE0AFE8b17e060d0';

export const staking = '0xE9eE84E403643AC9859180Dc0a7432202639FB26';
export const distributor = '0x78cBfDa5ba1F521d3B79855D10720A84B7A63F3E';
export const treasury = '0x2da7ddAf58cd034AB025ed099e5d6840b01CABE5';
export const yieldLocker = '0xDb3aE504110b4Fe30dB93F134b12b6716506EA2a';
export const turbine = '0x6A7054e68B9335c31b75A4c67D2D6B5c819119B1';
export const taxReceiver = '0x2F89aDD2372FC333A216Bd080a1dAfba483eDe9B';
export const dao = '0x2904Ff480984411C74A377E127bB8D3Bb9F2873d';

//收益
export const ReferralRewardPool = '0x75FdCdC290BcfCa982d7eCBF87f07Ba366aBB937'; // 矩阵
export const TitleRewardPool = '0xE3132241cf5513dB86b0AD40d9Ce2b561C1Ca545'; // 布道
export const ReverseRewardPool = '0x09724aE039aD5419B0d0D7Fee6654055F504b9ef';
export const ServiceRewardPool = '0x25F22c4a322DFC90A2dc48517450C2a7786928A2'; // 推荐
export const LeadRewardPool = '0x97E3CEb029631AddCA28a5284e30c9c94B10bAf4'; // 平超

// 代币合约地址
export const TOKEN_ADDRESSES = {
  OLY: OLY,
  DAI: DAI,
} as const;

export const chainId = bscTestnet.id;
export const blocks = 0.75;
