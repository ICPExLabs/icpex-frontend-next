import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';
import type { Principal } from '@dfinity/principal';

export interface Account {
    owner: Principal;
    subaccount: [] | [Uint8Array | number[]];
}
export type Amm = { 'swap_v2_1%': null } | { 'swap_v2_0.05%': null } | { 'swap_v2_0.3%': null };
export type BusinessError =
    | { InvalidTokenPair: [Principal, Principal] }
    | { TokenBlockChainLocked: null }
    | { TransferError: TransferError }
    | { NotSupportedToken: Principal }
    | { Swap: string }
    | { TokenPairAmmNotExist: TokenPairAmm }
    | { TokenAccountsLocked: Array<TokenAccount> }
    | { MemoTooLong: null }
    | { InsufficientBalance: { token: Principal; balance: bigint } }
    | { TokenPairAmmExist: TokenPairAmm }
    | { RequestTraceLocked: string }
    | { InvalidCreated: { created: bigint; system: bigint } }
    | { InvalidAmm: string }
    | { InvalidTransferFee: { fee: bigint; token: Principal } }
    | { SwapBlockChainLocked: null }
    | { TokenBlockChainError: string }
    | { TransferFromError: TransferFromError }
    | { TokenAccountsUnlocked: Array<TokenAccount> }
    | { NotOwner: Principal }
    | { SwapBlockChainError: string }
    | { CallCanisterError: [RejectionCode, string] }
    | { Liquidity: string }
    | { Expired: { deadline: bigint; system: bigint } };
export interface BusinessLocks {
    token: [] | [boolean];
    swap: [] | [boolean];
    balances: [] | [Array<TokenAccount>];
}
export interface CanisterStatusResponse {
    status: CanisterStatusType;
    memory_size: bigint;
    cycles: bigint;
    settings: DefiniteCanisterSettings;
    query_stats: QueryStats;
    idle_cycles_burned_per_day: bigint;
    module_hash: [] | [Uint8Array | number[]];
    reserved_cycles: bigint;
}
export type CanisterStatusType = { stopped: null } | { stopping: null } | { running: null };
export interface DefiniteCanisterSettings {
    freezing_threshold: bigint;
    controllers: Array<Principal>;
    reserved_cycles_limit: bigint;
    log_visibility: LogVisibility;
    wasm_memory_limit: bigint;
    memory_allocation: bigint;
    compute_allocation: bigint;
}
export interface DepositToken {
    to: Account;
    token: Principal;
    from: Account;
    amount: bigint;
}
export interface ExampleVec {
    vec_data: bigint;
}
export interface InitArg {
    maintainers: [] | [Array<Principal>];
    schedule: [] | [bigint];
}
export type InitArgs = { V0: InitArg } | { V1: InitArg };
export interface InnerLP {
    fee: bigint;
    decimals: number;
    dummy_canister_id: Principal;
    minimum_liquidity: bigint;
    total_supply: bigint;
}
export type LogVisibility = { controllers: null } | { public: null } | { allowed_viewers: Array<Principal> };
export type MarketMakerView = { swap_v2: SwapV2MarketMakerView };
export interface MigratedRecords {
    records: Array<Record>;
    next_id: bigint;
    removed: bigint;
}
export interface OuterLP {
    fee: bigint;
    decimals: number;
    token_canister_id: Principal;
    minimum_liquidity: bigint;
    total_supply: bigint;
}
export interface PageData {
    total: bigint;
    data: Array<Record>;
    page: bigint;
    size: number;
}
export interface PairCreate {
    pa: TokenPairAmm;
    creator: Principal;
}
export interface PairCreateArgWithMeta {
    arg: TokenPairAmm;
    now: bigint;
    created: [] | [bigint];
    memo: [] | [Uint8Array | number[]];
    caller: Principal;
}
export interface PairCumulativePrice {
    pa: TokenPairAmm;
    price_cumulative_exponent: number;
    price0_cumulative: bigint;
    block_timestamp: bigint;
    price1_cumulative: bigint;
}
export interface PairLiquidityAddArgWithMeta {
    arg: TokenPairLiquidityAddArg;
    now: bigint;
    created: [] | [bigint];
    memo: [] | [Uint8Array | number[]];
    caller: Principal;
}
export interface PairLiquidityRemoveArgWithMeta {
    arg: TokenPairLiquidityRemoveArg;
    now: bigint;
    created: [] | [bigint];
    memo: [] | [Uint8Array | number[]];
    caller: Principal;
}
export type PairOperation = { swap: PairSwapToken } | { swap_v2: SwapV2Operation } | { create: PairCreate };
export interface PairSwapByLoanArgWithMeta {
    arg: TokenPairSwapByLoanArg;
    now: bigint;
    created: [] | [bigint];
    memo: [] | [Uint8Array | number[]];
    caller: Principal;
}
export interface PairSwapExactTokensForTokensArgWithMeta {
    arg: TokenPairSwapExactTokensForTokensArg;
    now: bigint;
    created: [] | [bigint];
    memo: [] | [Uint8Array | number[]];
    caller: Principal;
}
export interface PairSwapToken {
    to: Account;
    amm: Amm;
    token_a: Principal;
    token_b: Principal;
    from: Account;
    amount_a: bigint;
    amount_b: bigint;
}
export interface PairSwapTokensForExactTokensArgWithMeta {
    arg: TokenPairSwapTokensForExactTokensArg;
    now: bigint;
    created: [] | [bigint];
    memo: [] | [Uint8Array | number[]];
    caller: Principal;
}
export interface PauseReason {
    timestamp_nanos: bigint;
    message: string;
}
export type Permission = { Permitted: string } | { Forbidden: string };
export type PermissionUpdatedArg =
    | {
          UpdateRolePermission: [string, [] | [Array<string>]];
      }
    | { UpdateUserPermission: [Principal, [] | [Array<string>]] }
    | { UpdateUserRole: [Principal, [] | [Array<string>]] };
export type PoolLp = { outer: OuterLP } | { inner: InnerLP };
export interface QueryPage {
    page: bigint;
    size: number;
}
export interface QueryStats {
    response_payload_bytes_total: bigint;
    num_instructions_total: bigint;
    num_calls_total: bigint;
    request_payload_bytes_total: bigint;
}
export type QuerySwapBlockResult = { archive: Principal } | { block: SwapBlock };
export type QueryTokenBlockResult = { archive: Principal } | { block: TokenBlock };
export interface Record {
    id: bigint;
    created: bigint;
    topic: number;
    content: string;
    done: [] | [[bigint, string]];
    caller: Principal;
}
export interface RecordSearchArg {
    id: [] | [[[] | [bigint], [] | [bigint]]];
    created: [] | [[[] | [bigint], [] | [bigint]]];
    topic: [] | [Array<string>];
    content: [] | [string];
    caller: [] | [Array<Principal>];
}
export type RejectionCode =
    | { NoError: null }
    | { CanisterError: null }
    | { SysTransient: null }
    | { DestinationInvalid: null }
    | { Unknown: null }
    | { SysFatal: null }
    | { CanisterReject: null };
export type RequestArgs =
    | { token_deposit: TokenDepositArgWithMeta }
    | { pair_create: PairCreateArgWithMeta }
    | {
          pair_swap_exact_tokens_for_tokens: PairSwapExactTokensForTokensArgWithMeta;
      }
    | { pair_liquidity_add: PairLiquidityAddArgWithMeta }
    | { token_transfer: TokenTransferArgWithMeta }
    | { pair_swap_by_loan: PairSwapByLoanArgWithMeta }
    | { pair_liquidity_remove: PairLiquidityRemoveArgWithMeta }
    | {
          pair_swap_tokens_for_exact_tokens: PairSwapTokensForExactTokensArgWithMeta;
      }
    | { token_withdraw: TokenDepositArgWithMeta };
export interface RequestTrace {
    args: RequestArgs;
    done: [] | [[bigint, Result]];
    traces: Array<[bigint, string]>;
    locks: BusinessLocks;
    index: bigint;
}
export type Result = { Ok: string } | { Err: string };
export interface SwapBlock {
    transaction: SwapTransaction;
    timestamp: bigint;
    parent_hash: Uint8Array | number[];
}
export type SwapOperation = { pair: PairOperation };
export interface SwapTokenPair {
    amm: string;
    token: [Principal, Principal];
}
export interface SwapTransaction {
    created: [] | [bigint];
    memo: [] | [Uint8Array | number[]];
    operation: SwapOperation;
}
export interface SwapV2BurnToken {
    pa: TokenPairAmm;
    to: Account;
    token: Principal;
    from: Account;
    amount0: bigint;
    amount1: bigint;
    token0: Principal;
    token1: Principal;
    amount: bigint;
}
export interface SwapV2MarketMakerView {
    lp: PoolLp;
    price_cumulative_exponent: number;
    block_timestamp_last: bigint;
    reserve0: string;
    reserve1: string;
    subaccount: string;
    price1_cumulative_last: string;
    token0: string;
    token1: string;
    fee_rate: string;
    k_last: string;
    protocol_fee: [] | [string];
    price0_cumulative_last: string;
}
export interface SwapV2MintFeeToken {
    pa: TokenPairAmm;
    to: Account;
    token: Principal;
    amount: bigint;
}
export type SwapV2Operation =
    | { burn: SwapV2BurnToken }
    | { mint: SwapV2BurnToken }
    | { mint_fee: SwapV2MintFeeToken }
    | { cumulative_price: PairCumulativePrice };
export interface TokenAccount {
    token: Principal;
    account: Account;
}
export interface TokenBlock {
    transaction: TokenTransaction;
    timestamp: bigint;
    parent_hash: Uint8Array | number[];
}
export type TokenChangedResult = { Ok: bigint } | { Err: BusinessError };
export interface TokenDepositArgWithMeta {
    arg: DepositToken;
    now: bigint;
    created: [] | [bigint];
    memo: [] | [Uint8Array | number[]];
    caller: Principal;
}
export interface TokenDepositArgs {
    to: Account;
    created: [] | [bigint];
    token: Principal;
    from: Account;
    memo: [] | [Uint8Array | number[]];
    deposit_amount_without_fee: bigint;
}
export interface TokenInfo {
    fee: bigint;
    decimals: number;
    name: string;
    canister_id: Principal;
    symbol: string;
}
export type TokenOperation = { withdraw: DepositToken } | { deposit: DepositToken } | { transfer: TransferToken };
export interface TokenPair {
    token0: Principal;
    token1: Principal;
}
export interface TokenPairAmm {
    amm: Amm;
    pair: TokenPair;
}
export interface TokenPairCreateArgs {
    created: [] | [bigint];
    memo: [] | [Uint8Array | number[]];
    pool: TokenPairPool;
}
export type TokenPairCreateResult = { Ok: MarketMakerView } | { Err: BusinessError };
export interface TokenPairLiquidityAddArg {
    pa: TokenPairAmm;
    to: Account;
    amount_a_min: bigint;
    token_a: Principal;
    token_b: Principal;
    self_canister: Principal;
    from: Account;
    amount_b_desired: bigint;
    amount_a_desired: bigint;
    amount_b_min: bigint;
}
export interface TokenPairLiquidityAddArgs {
    to: Account;
    created: [] | [bigint];
    from: Account;
    memo: [] | [Uint8Array | number[]];
    deadline: [] | [bigint];
    amount_desired: [bigint, bigint];
    amount_min: [bigint, bigint];
    swap_pair: SwapTokenPair;
}
export type TokenPairLiquidityAddResult =
    | {
          Ok: TokenPairLiquidityAddSuccess;
      }
    | { Err: BusinessError };
export interface TokenPairLiquidityAddSuccess {
    liquidity: bigint;
    amount: [bigint, bigint];
}
export interface TokenPairLiquidityRemoveArg {
    pa: TokenPairAmm;
    to: Account;
    amount_a_min: bigint;
    token_a: Principal;
    token_b: Principal;
    self_canister: Principal;
    from: Account;
    liquidity: bigint;
    amount_b_min: bigint;
}
export interface TokenPairLiquidityRemoveArgs {
    to: Account;
    created: [] | [bigint];
    from: Account;
    memo: [] | [Uint8Array | number[]];
    liquidity: bigint;
    deadline: [] | [bigint];
    amount_min: [bigint, bigint];
    swap_pair: SwapTokenPair;
}
export type TokenPairLiquidityRemoveResult =
    | {
          Ok: TokenPairLiquidityRemoveSuccess;
      }
    | { Err: BusinessError };
export interface TokenPairLiquidityRemoveSuccess {
    amount: [bigint, bigint];
}
export interface TokenPairPool {
    amm: string;
    token0: Principal;
    token1: Principal;
}
export interface TokenPairSwapByLoanArg {
    to: Account;
    pas: Array<TokenPairAmm>;
    self_canister: Principal;
    from: Account;
    loan: bigint;
    path: Array<SwapTokenPair>;
}
export interface TokenPairSwapByLoanArgs {
    to: Account;
    created: [] | [bigint];
    from: Account;
    loan: bigint;
    memo: [] | [Uint8Array | number[]];
    path: Array<SwapTokenPair>;
    deadline: [] | [bigint];
}
export interface TokenPairSwapExactTokensForTokensArg {
    to: Account;
    pas: Array<TokenPairAmm>;
    self_canister: Principal;
    amount_out_min: bigint;
    from: Account;
    path: Array<SwapTokenPair>;
    amount_in: bigint;
}
export interface TokenPairSwapExactTokensForTokensArgs {
    to: Account;
    created: [] | [bigint];
    amount_out_min: bigint;
    from: Account;
    memo: [] | [Uint8Array | number[]];
    path: Array<SwapTokenPair>;
    deadline: [] | [bigint];
    amount_in: bigint;
}
export interface TokenPairSwapTokensForExactTokensArg {
    to: Account;
    pas: Array<TokenPairAmm>;
    self_canister: Principal;
    from: Account;
    path: Array<SwapTokenPair>;
    amount_out: bigint;
    amount_in_max: bigint;
}
export interface TokenPairSwapTokensForExactTokensArgs {
    to: Account;
    created: [] | [bigint];
    from: Account;
    memo: [] | [Uint8Array | number[]];
    path: Array<SwapTokenPair>;
    deadline: [] | [bigint];
    amount_out: bigint;
    amount_in_max: bigint;
}
export type TokenPairSwapTokensResult = { Ok: TokenPairSwapTokensSuccess } | { Err: BusinessError };
export interface TokenPairSwapTokensSuccess {
    amounts: Array<bigint>;
}
export interface TokenTransaction {
    created: [] | [bigint];
    memo: [] | [Uint8Array | number[]];
    operation: TokenOperation;
}
export interface TokenTransferArgWithMeta {
    arg: TransferToken;
    now: bigint;
    created: [] | [bigint];
    memo: [] | [Uint8Array | number[]];
    caller: Principal;
}
export interface TokenTransferArgs {
    to: Account;
    fee: [] | [bigint];
    created: [] | [bigint];
    token: Principal;
    from: Account;
    memo: [] | [Uint8Array | number[]];
    transfer_amount_without_fee: bigint;
}
export interface TokenWithdrawArgs {
    to: Account;
    created: [] | [bigint];
    token: Principal;
    from: Account;
    memo: [] | [Uint8Array | number[]];
    withdraw_amount_without_fee: bigint;
}
export type TransferError =
    | {
          GenericError: { message: string; error_code: bigint };
      }
    | { TemporarilyUnavailable: null }
    | { BadBurn: { min_burn_amount: bigint } }
    | { Duplicate: { duplicate_of: bigint } }
    | { BadFee: { expected_fee: bigint } }
    | { CreatedInFuture: { ledger_time: bigint } }
    | { TooOld: null }
    | { InsufficientFunds: { balance: bigint } };
export interface TransferFee {
    fee: bigint;
    fee_to: Account;
}
export type TransferFromError =
    | {
          GenericError: { message: string; error_code: bigint };
      }
    | { TemporarilyUnavailable: null }
    | { InsufficientAllowance: { allowance: bigint } }
    | { BadBurn: { min_burn_amount: bigint } }
    | { Duplicate: { duplicate_of: bigint } }
    | { BadFee: { expected_fee: bigint } }
    | { CreatedInFuture: { ledger_time: bigint } }
    | { TooOld: null }
    | { InsufficientFunds: { balance: bigint } };
export interface TransferToken {
    to: Account;
    fee: [] | [TransferFee];
    token: Principal;
    from: Account;
    amount: bigint;
}
export interface _SERVICE {
    __get_candid_interface_tmp_hack: ActorMethod<[], string>;
    block_swap_get: ActorMethod<[bigint], QuerySwapBlockResult>;
    block_token_get: ActorMethod<[bigint], QueryTokenBlockResult>;
    business_example_cell_query: ActorMethod<[], string>;
    business_example_cell_set: ActorMethod<[string], undefined>;
    business_example_log_query: ActorMethod<[], Array<string>>;
    business_example_log_update: ActorMethod<[string], bigint>;
    business_example_map_query: ActorMethod<[], Array<[bigint, string]>>;
    business_example_map_update: ActorMethod<[bigint, [] | [string]], [] | [string]>;
    business_example_priority_queue_pop: ActorMethod<[], [] | [bigint]>;
    business_example_priority_queue_push: ActorMethod<[bigint], undefined>;
    business_example_priority_queue_query: ActorMethod<[], BigUint64Array | bigint[]>;
    business_example_query: ActorMethod<[], string>;
    business_example_set: ActorMethod<[string], undefined>;
    business_example_vec_pop: ActorMethod<[], [] | [ExampleVec]>;
    business_example_vec_push: ActorMethod<[bigint], undefined>;
    business_example_vec_query: ActorMethod<[], Array<ExampleVec>>;
    canister_status: ActorMethod<[], CanisterStatusResponse>;
    config_fee_to_query: ActorMethod<[], [] | [Account]>;
    config_fee_to_replace: ActorMethod<[[] | [Account]], [] | [Account]>;
    pair_create: ActorMethod<[TokenPairCreateArgs], TokenPairCreateResult>;
    pair_liquidity_add: ActorMethod<[TokenPairLiquidityAddArgs, [] | [number]], TokenPairLiquidityAddResult>;
    pair_liquidity_remove: ActorMethod<[TokenPairLiquidityRemoveArgs, [] | [number]], TokenPairLiquidityRemoveResult>;
    pair_query: ActorMethod<[TokenPairPool], [] | [MarketMakerView]>;
    pair_swap_by_loan: ActorMethod<[TokenPairSwapByLoanArgs, [] | [number]], TokenPairSwapTokensResult>;
    pair_swap_exact_tokens_for_tokens: ActorMethod<
        [TokenPairSwapExactTokensForTokensArgs, [] | [number]],
        TokenPairSwapTokensResult
    >;
    pair_swap_tokens_for_exact_tokens: ActorMethod<
        [TokenPairSwapTokensForExactTokensArgs, [] | [number]],
        TokenPairSwapTokensResult
    >;
    pairs_query: ActorMethod<[], Array<[TokenPairPool, MarketMakerView]>>;
    pause_query: ActorMethod<[], boolean>;
    pause_query_reason: ActorMethod<[], [] | [PauseReason]>;
    pause_replace: ActorMethod<[[] | [string]], undefined>;
    permission_all: ActorMethod<[], Array<Permission>>;
    permission_assigned_by_user: ActorMethod<[Principal], [] | [Array<Permission>]>;
    permission_assigned_query: ActorMethod<[], [] | [Array<Permission>]>;
    permission_find_by_user: ActorMethod<[Principal], Array<string>>;
    permission_query: ActorMethod<[], Array<string>>;
    permission_roles_all: ActorMethod<[], Array<[string, Array<Permission>]>>;
    permission_roles_by_user: ActorMethod<[Principal], [] | [Array<string>]>;
    permission_roles_query: ActorMethod<[], [] | [Array<string>]>;
    permission_update: ActorMethod<[Array<PermissionUpdatedArg>], undefined>;
    record_find_by_page: ActorMethod<[QueryPage, [] | [RecordSearchArg]], PageData>;
    record_migrate: ActorMethod<[number], MigratedRecords>;
    record_topics: ActorMethod<[], Array<string>>;
    request_trace_get: ActorMethod<[bigint], [] | [RequestTrace]>;
    request_trace_index_get: ActorMethod<[], [bigint, bigint]>;
    request_trace_remove: ActorMethod<[bigint], [] | [RequestTrace]>;
    schedule_find: ActorMethod<[], [] | [bigint]>;
    schedule_replace: ActorMethod<[[] | [bigint]], undefined>;
    schedule_trigger: ActorMethod<[], undefined>;
    test_withdraw_all_tokens: ActorMethod<[Array<Principal>], Array<string>>;
    token_balance: ActorMethod<[Principal, [] | [Uint8Array | number[]]], bigint>;
    token_balance_by: ActorMethod<[Principal, Account], bigint>;
    token_balance_of: ActorMethod<[Principal, Account], bigint>;
    token_deposit: ActorMethod<[TokenDepositArgs, [] | [number]], TokenChangedResult>;
    token_query: ActorMethod<[Principal], [] | [TokenInfo]>;
    token_transfer: ActorMethod<[TokenTransferArgs, [] | [number]], TokenChangedResult>;
    token_withdraw: ActorMethod<[TokenWithdrawArgs, [] | [number]], TokenChangedResult>;
    tokens_balance: ActorMethod<[[] | [Uint8Array | number[]]], Array<[Principal, bigint]>>;
    tokens_balance_by: ActorMethod<[Account], Array<[Principal, bigint]>>;
    tokens_balance_of: ActorMethod<[Account], Array<[Principal, bigint]>>;
    tokens_query: ActorMethod<[], Array<TokenInfo>>;
    version: ActorMethod<[], number>;
    wallet_balance: ActorMethod<[], bigint>;
    wallet_receive: ActorMethod<[], bigint>;
    whoami: ActorMethod<[], Principal>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
