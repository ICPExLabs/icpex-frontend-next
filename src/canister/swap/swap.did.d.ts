import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';
import type { Principal } from '@dfinity/principal';

export interface Account {
    owner: Principal;
    subaccount: [] | [Uint8Array | number[]];
}
export type BusinessError =
    | { InvalidTokenPair: [Principal, Principal] }
    | { TransferError: TransferError }
    | { NotSupportedToken: Principal }
    | { Swap: string }
    | { TokenPairAmmNotExist: [TokenPair, string] }
    | { InsufficientBalance: [Principal, bigint] }
    | { TokenPairAmmExist: [TokenPair, string] }
    | { InvalidAmm: string }
    | { Locked: Array<TokenAccount> }
    | { TransferFromError: TransferFromError }
    | { NotOwner: Principal }
    | { CallCanisterError: [RejectionCode, string] }
    | { Liquidity: string }
    | { Expired: bigint };
export type BusinessResult = { Ok: null } | { Err: BusinessError };
export interface CanisterInitialArg {
    schedule: [] | [bigint];
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
export interface ExampleVec {
    vec_data: bigint;
}
export interface InnerLP {
    fee: bigint;
    decimals: number;
    dummy_canister_id: Principal;
    minimum_liquidity: bigint;
    total_supply: bigint;
}
export type LogVisibility = { controllers: null } | { public: null } | { allowed_viewers: Array<Principal> };
export type MarketMakerView = { SwapV2: SwapV2MarketMakerView };
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
export type PoolLp = { InnerLP: InnerLP } | { OuterLP: OuterLP };
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
export interface SwapV2MarketMakerView {
    lp: PoolLp;
    block_timestamp_last: bigint;
    price_cumulative_unit: bigint;
    reserve0: bigint;
    reserve1: bigint;
    subaccount: string;
    price1_cumulative_last: bigint;
    token0: string;
    token1: string;
    fee_rate: string;
    k_last: bigint;
    protocol_fee: [] | [string];
    price0_cumulative_last: bigint;
}
export interface TokenAccount {
    token: Principal;
    account: Account;
}
export interface TokenDepositArgs {
    token: Principal;
    from: Account;
    amount_without_fee: bigint;
}
export interface TokenInfo {
    fee: bigint;
    decimals: number;
    name: string;
    canister_id: Principal;
    symbol: string;
}
export interface TokenPair {
    token0: Principal;
    token1: Principal;
}
export interface TokenPairLiquidityAddArgs {
    to: Account;
    from: Account;
    pool: TokenPairPool;
    deadline: [] | [bigint];
    amount_desired: [bigint, bigint];
    amount_min: [bigint, bigint];
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
export interface TokenPairLiquidityRemoveArgs {
    to: Account;
    from: Account;
    pool: TokenPairPool;
    liquidity: bigint;
    deadline: [] | [bigint];
    amount_min: [bigint, bigint];
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
    pair: [Principal, Principal];
}
export interface TokenPairSwapExactTokensForTokensArgs {
    to: Account;
    amount_out_min: bigint;
    from: Account;
    path: Array<TokenPairPool>;
    deadline: [] | [bigint];
    amount_in: bigint;
}
export interface TokenPairSwapTokensForExactTokensArgs {
    to: Account;
    from: Account;
    path: Array<TokenPairPool>;
    deadline: [] | [bigint];
    amount_out: bigint;
    amount_in_max: bigint;
}
export type TokenPairSwapTokensResult = { Ok: TokenPairSwapTokensSuccess } | { Err: BusinessError };
export interface TokenPairSwapTokensSuccess {
    amounts: Array<bigint>;
}
export type TokenTransferResult = { Ok: bigint } | { Err: BusinessError };
export interface TokenWithdrawArgs {
    to: Account;
    token: Principal;
    from: Account;
    amount_without_fee: bigint;
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
export interface _SERVICE {
    __get_candid_interface_tmp_hack: ActorMethod<[], string>;
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
    pair_create: ActorMethod<[TokenPairPool], BusinessResult>;
    pair_liquidity_add: ActorMethod<[TokenPairLiquidityAddArgs, [] | [number]], TokenPairLiquidityAddResult>;
    pair_liquidity_remove: ActorMethod<[TokenPairLiquidityRemoveArgs, [] | [number]], TokenPairLiquidityRemoveResult>;
    pair_query: ActorMethod<[TokenPairPool], [] | [MarketMakerView]>;
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
    schedule_find: ActorMethod<[], [] | [bigint]>;
    schedule_replace: ActorMethod<[[] | [bigint]], undefined>;
    schedule_trigger: ActorMethod<[], undefined>;
    test_withdraw_all_tokens: ActorMethod<[Array<Principal>], Array<string>>;
    token_balance_of: ActorMethod<[Principal, Account], bigint>;
    token_deposit: ActorMethod<[TokenDepositArgs, [] | [number]], TokenTransferResult>;
    token_query: ActorMethod<[Principal], [] | [TokenInfo]>;
    token_withdraw: ActorMethod<[TokenWithdrawArgs, [] | [number]], TokenTransferResult>;
    tokens_balance_of: ActorMethod<[Account], Array<[Principal, bigint]>>;
    tokens_query: ActorMethod<[], Array<TokenInfo>>;
    version: ActorMethod<[], number>;
    wallet_balance: ActorMethod<[], bigint>;
    wallet_receive: ActorMethod<[], bigint>;
    whoami: ActorMethod<[], Principal>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
