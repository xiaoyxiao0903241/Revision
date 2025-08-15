// 定义错误类型
export type ContractError = {
  code: string;
  message: string;
};

// 错误映射表
export const errorMap: Record<string, string> = {
  // Staking.sol
  'Ownable: new owner is the zero address': 'ownable.zero_address',
  'Ownable: must be new owner to pull': 'ownable.must_be_new_owner',
  'Caller is not authorized to stake bonds': 'staking.unauthorized_bonds',
  'Caller is not authorized to stake': 'fee.unauthorized',
  'Amount exceeds': 'staking.amount_exceeds',
  'Ownable: caller is not the owner': 'ownable.not_owner',

  // TaxReceiver.sol
  'Amount must be greater than zero': 'tax.zero_amount',
  'Zero address not allowed': 'tax.zero_address',

  // Turbine.sol
  'Only owner allowed': 'turbine.owner_only',
  'No claims available': 'turbine.no_claims',
  'Invalid claim index': 'turbine.invalid_claim',
  'No silence balance': 'turbine.no_silence',
  'Silent time not reached': 'turbine.silent_time',
  'No enough turbine balance': 'turbine.insufficient_balance',
  'Invalid _demandStaking': 'turbine.invalid_demand_staking',

  // FeeReceiver.sol
  'Caller is not authorized': 'fee.unauthorized',

  // Treasury.sol
  'SafeMath: addition overflow': 'treasury.addition_overflow',
  'SafeMath: multiplication overflow': 'treasury.multiplication_overflow',
  'Address: call to non-contract (Treasury)': 'treasury.non_contract',
  'Treasury: Insufficient balance': 'treasury.insufficient_balance',
  'Not approved': 'treasury.not_approved',
  'Not accepted': 'treasury.not_accepted',
  'Exceeds debt limit': 'treasury.debt_limit',
  'No outstanding debt': 'treasury.no_debt',
  'Outstanding debt': 'treasury.outstanding_debt',
  'No collateral locked': 'treasury.no_collateral',
  'Insufficient reserves': 'treasury.insufficient_reserves',
  'Must queue': 'treasury.must_queue',
  'Queue not expired': 'treasury.queue_not_expired',

  // LPHelper.sol
  'SafeERC20: transfer failed': 'lp.transfer_failed',
  'SafeERC20: transferFrom failed': 'lp.transfer_from_failed',
  'SafeERC20: approve failed': 'lp.approve_failed',
  'OHM address cannot be zero': 'lp.zero_ohm',
  'Router address cannot be zero': 'lp.zero_router',
  'Bond contract address cannot be zero': 'lp.zero_bond',
  'Slippage cannot be more than 100%': 'lp.slippage',
  'Bond contract not set': 'lp.bond_not_set',
  'Invalid depositor address': 'lp.invalid_depositor',
  'Amount must be greater than 0': 'lp.zero_amount',
  'Pair does not exist': 'lp.no_pair',
  'No LP tokens received': 'lp.no_lp_tokens',
  'LP approval failed': 'lp.lp_approval_failed',
  'Bond deposit failed': 'lp.bond_deposit_failed',
  'Atomic operation failed': 'lp.atomic_failed',
  'amountIn must be > 0': 'lp.zero_amount_in',
  'LPHelper: insufficient allowance': 'lp.insufficient_allowance',
  'Swap failed: no tokens received': 'lp.swap_failed',
  'approve tokenB failed': 'lp.approve_token_b_failed',
  'approve usdt failed': 'lp.approve_usdt_failed',

  // NodeStaking.sol
  'Maintainence period not allow stake': 'node.maintenance',
  'NodeStaking: Invalid data': 'node.invalid_data',
  'NodeStaking: Stake failure': 'node.stake_failed',
  'Stake record does not exist': 'node.no_record',
  'Still in warmup period': 'node.warmup',
  'SafeMath: subtraction overflow': 'node.subtraction_overflow',
  'Amount exceeds available interest': 'node.interest_exceeded',

  // StakingDistributor.sol
  'SafeERC20: ERC20 operation did not succeed': 'distributor.erc20_failed',
  'Address: insufficient balance': 'distributor.insufficient_balance',
  'Address: unable to send value': 'distributor.send_failed',
  'Address: insufficient balance for call': 'distributor.call_balance',
  'Address: call to non-contract (Distributor)': 'distributor.non_contract',
  'SafeERC20: low-level call failed': 'distributor.low_level_failed',

  // AKASDao.sol
  'Already exists': 'dao.already_exists',
  'Claim completed': 'dao.claim_completed',
  'DAO: Insufficient balance': 'dao.insufficient_balance',

  // DemandStaking.sol
  'DemandStaking: Invalid amount': 'demand.invalid_amount',

  // NodeSales.sol
  AlreadyClaimed: 'sales.already_claimed',
  AlreadyPaused: 'sales.already_paused',
  // 'InvalidInitialization': 'sales.invalid_initialization',
  NotActive: 'sales.not_active',
  // 'NotInitializing': 'sales.not_initializing',
  NotPaused: 'sales.not_paused',
  // 'OwnableInvalidOwner': 'sales.ownable_invalid_owner',
  // 'OwnableUnauthorizedAccount': 'sales.ownable_unauthorized_account',
  Paused: 'sales.paused',
  RewardNotClaimable: 'sales.reward_not_claimable',
  SafeERC20FailedOperation: 'sales.safe_erc20_failed_operation',
  SaleEnded: 'sales.sale_ended',
  SaleNotStarted: 'sales.sale_not_started',
  ZeroAddress: 'sales.zero_address',

  // YieldLocker.sol
  'YieldLocker: Invalid index': 'yield.invalid_index',
  'YieldLocker: Invalid amount': 'yield.invalid_amount',
  'YieldLocker: Invalid address': 'yield.invalid_address',

  // RewardPool.sol
  'Invalid signer': 'reward.invalid_signer',
  'RewardPool: Invalid data': 'reward.invalid_data',

  // sOHM.sol
  'ZeroSwapPermit: Invalid signature': 'sohm.invalid_signature',
  'Address: low-level call failed': 'sohm.call_failed',
  'Address: low-level call with value failed': 'sohm.call_with_value_failed',
  'Address: low-level static call failed': 'sohm.static_call_failed',
  'Address: low-level delegate call failed': 'sohm.delegate_call_failed',

  // BondDepository.sol
  'Already initialized': 'bond.already_initialized',
  'Invalid OHM address': 'bond.invalid_ohm',
  'Invalid sOHM address': 'bond.invalid_sohm',
  'Invalid principle address': 'bond.invalid_principle',
  'Invalid treasury address': 'bond.invalid_treasury',
  'Invalid DAO address': 'bond.invalid_dao',
  'Invalid owner address': 'bond.invalid_owner',
  'Not initialized': 'bond.not_initialized',
  'Bonds must be initialized from 0': 'bond.init_from_zero',
  'Vesting must be longer than 36 hours': 'bond.vesting_time',
  'Payout cannot be above 5 percent': 'bond.payout_limit',
  'DAO fee cannot exceed payout': 'bond.dao_fee',
  'User not active': 'bond.user_inactive',
  'Max capacity reached': 'bond.max_capacity',
  'Bond too small': 'bond.too_small',
  'Bond too large': 'bond.too_large',
  'Invalid bond index': 'bond.invalid_index',
  'Bond does not exist': 'bond.not_exist',
  'No active stake': 'bond.no_stake',
  'Stake index mismatch': 'bond.stake_mismatch',
  'Amount exceeds balance': 'bond.balance_exceeded',
  'Only the owner can claim': 'bond.owner_only',
  'No profit to claim': 'bond.no_profit',
  'Profit exceeds amount': 'bond.profit_exceeded',
  'Invalid yield locker address': 'bond.invalid_locker',

  // LongStaking.sol
  'LongStaking: Invalid stake index': 'long.invalid_index',
  'LongStaking: Stake failure': 'long.stake_failed',
  'LongStaking: Invalid amount': 'long.invalid_amount',

  // MatrixNetwork.sol
  'Empty address list': 'matrix.empty_list',
  'First address cannot be zero': 'matrix.first_zero',
  'Zero address not allowed (MatrixNetwork)': 'matrix.zero_address',
  'Already active': 'matrix.already_active',
  'Referrer not active': 'matrix.referrer_inactive',
  'MatrixNetwork: Invalid address': 'matrix.invalid_address',
  'Not active (MatrixNetwork)': 'matrix.not_active',
  'Start index overflow': 'matrix.index_overflow',
  AlreadyActived: 'matrix.already_actived',
  InvalidAddress: 'matrix.invalid_address',
  InvalidInitialization: 'matrix.invalid_initialization',
  InvalidLength: 'matrix.invalid_length',
  NotActivated: 'matrix.not_activated',
  NotInitializing: 'matrix.not_initializing',
  OwnableInvalidOwner: 'matrix.ownable_invalid_owner',
  OwnableUnauthorizedAccount: 'matrix.ownable_unauthorized_account',

  // OHM.sol
  'Invalid fee receiver': 'ohm.invalid_fee_receiver',
  'Invalid buy fee ratio': 'ohm.invalid_fee_ratio',

  // StandardBondingCalculator.sol
  TRANSFER_FROM_FAILED: 'calculator.transfer_from_failed',
  TRANSFER_FAILED: 'calculator.transfer_failed',
  APPROVE_FAILED: 'calculator.approve_failed',
  ETH_TRANSFER_FAILED: 'calculator.eth_transfer_failed',
  'Invalid pair': 'calculator.invalid_pair',
  // UserRejected
  'User rejected': 'user_rejected',
  'already joined': 'referral.already_joined',
  'invalid referrer': 'invalid_referrer',
  AccessControlBadConfirmation: 'user_AccessControlBadConfirmation',
  AccessControlUnauthorizedAccount: 'user_AccessControlUnauthorizedAccount',
  expired: 'toast.transaction_expired',
  slippage: 'toast.slippage_too_high',
  insufficient: 'toast.insufficient_balance',
};

/**
 * 检查是否是合约错误
 * @param error 错误对象或错误消息
 * @returns 是否是合约错误
 */
export const isContractError = (error: Error | string): boolean => {
  const errorMessage = typeof error === 'object' ? error.message : error;
  return !!errorMap[errorMessage];
};
