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
export const DAI = '0x206E0d31754bE8764Ea1434b77FA480Bd99657C8';
export const OLY = '0x59f931448275047311D0221cECb94cE51517fd58'; //0x6A92B1E99De09f71CD96BC91F934826d96B8b26E
export const sOLY = '0xAdB8F0e721cE964cd43ba4419343623F8854EA28';
export const DAIAS = '0x13bd90982862b734DcaCfBce0daD11ea1903fB80';
export const DEX_ADDRESS = '0x10ED43C718714eb63d5aA57B78B54704E256024E';

//矩阵
export const matrixNetwork = '0x12a2C2EceFF21EFB61e1C8Dd04aCb4768a1b63E9';

//节点销售
export const nodeSales = '0x864EC402AAa01c236B5756f3b81ADF3c45beDE32';

//质押
export const nodeStaking = '0xC0E3F3E026feE27C01006be69759F37Ad4930a20';
export const demandStaking = '0xB5831E1C1488312b3516e7BcDDB5100da9D77DCc';
export const longStaking5 = '0xEf6018936E94cfa7c04A9dA39e2B4f3f5590f340';
// export const longStaking60 = '0xC2b5E282b68c2d68B5394Cc59D6D1b7DA965a86b';
// export const longStaking90 = '0x9e6D278751151555783FC06478E5A9Da1B1A1cA1';
export const longStaking180 = '0xb5632224eceBF48ebD790EADA5431c670207e69d';
export const longStaking360 = '0xEF721beE2E97a0375020580f8EFFaAf619B8BCf8';

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

export const staking = '0xCef261F5Ffd36fCA873Dd0b452A803AA639C65A0';
export const distributor = '0xdC918aB13088643AF2C3Fe973dFbD076F2e4Ec20';
export const treasury = '0x86010b3c6Fc4f3D340C2A9c11643B9faf442e22E';
export const yieldLocker = '0x14bC98F365EfeCDAA89ec7baaF99e77b513e4EAd';
export const turbine = '0x1998D579b429Cd61A3E3d4119d22a4D18b323051';
export const taxReceiver = '0xbB9898bA012d652E528e3E9D00D9102255C06396';
export const dao = '0xa8f816ee14636F807A6b93b386f96001a5Ca0bAF';

//收益
export const ReferralRewardPool = '0xed4862091EACd04E35BEFF5BD5994b976FAD27B0';
export const TitleRewardPool = '0x3E0a3329b41FAa2219Da3fa22e9e2eEc3bcDc386';
export const ReverseRewardPool = '0x09724aE039aD5419B0d0D7Fee6654055F504b9ef';
export const ServiceRewardPool = '0x38676302C31EDB0e9A17B0cC334B0d25a2e2035e';
export const LeadRewardPool = '0x509F19fB5B083adc9fDD4816cEEFE72466465B54';

// 代币合约地址
export const TOKEN_ADDRESSES = {
  OLY: OLY,
  DAI: DAI,
} as const;

export const chainId = bscTestnet.id;
export const blocks = 1.5;
