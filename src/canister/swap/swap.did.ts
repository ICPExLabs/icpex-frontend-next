export const idlFactory = ({ IDL }) => {
    const CanisterInitialArg = IDL.Record({ schedule: IDL.Opt(IDL.Nat) });
    const ExampleVec = IDL.Record({ vec_data: IDL.Nat64 });
    const CanisterStatusType = IDL.Variant({
        stopped: IDL.Null,
        stopping: IDL.Null,
        running: IDL.Null,
    });
    const LogVisibility = IDL.Variant({
        controllers: IDL.Null,
        public: IDL.Null,
        allowed_viewers: IDL.Vec(IDL.Principal),
    });
    const DefiniteCanisterSettings = IDL.Record({
        freezing_threshold: IDL.Nat,
        controllers: IDL.Vec(IDL.Principal),
        reserved_cycles_limit: IDL.Nat,
        log_visibility: LogVisibility,
        wasm_memory_limit: IDL.Nat,
        memory_allocation: IDL.Nat,
        compute_allocation: IDL.Nat,
    });
    const QueryStats = IDL.Record({
        response_payload_bytes_total: IDL.Nat,
        num_instructions_total: IDL.Nat,
        num_calls_total: IDL.Nat,
        request_payload_bytes_total: IDL.Nat,
    });
    const CanisterStatusResponse = IDL.Record({
        status: CanisterStatusType,
        memory_size: IDL.Nat,
        cycles: IDL.Nat,
        settings: DefiniteCanisterSettings,
        query_stats: QueryStats,
        idle_cycles_burned_per_day: IDL.Nat,
        module_hash: IDL.Opt(IDL.Vec(IDL.Nat8)),
        reserved_cycles: IDL.Nat,
    });
    const TokenPairPool = IDL.Record({
        amm: IDL.Text,
        pair: IDL.Tuple(IDL.Principal, IDL.Principal),
    });
    const TransferError = IDL.Variant({
        GenericError: IDL.Record({
            message: IDL.Text,
            error_code: IDL.Nat,
        }),
        TemporarilyUnavailable: IDL.Null,
        BadBurn: IDL.Record({ min_burn_amount: IDL.Nat }),
        Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
        BadFee: IDL.Record({ expected_fee: IDL.Nat }),
        CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
        TooOld: IDL.Null,
        InsufficientFunds: IDL.Record({ balance: IDL.Nat }),
    });
    const TokenPair = IDL.Record({
        token0: IDL.Principal,
        token1: IDL.Principal,
    });
    const Account = IDL.Record({
        owner: IDL.Principal,
        subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    });
    const TokenAccount = IDL.Record({
        token: IDL.Principal,
        account: Account,
    });
    const TransferFromError = IDL.Variant({
        GenericError: IDL.Record({
            message: IDL.Text,
            error_code: IDL.Nat,
        }),
        TemporarilyUnavailable: IDL.Null,
        InsufficientAllowance: IDL.Record({ allowance: IDL.Nat }),
        BadBurn: IDL.Record({ min_burn_amount: IDL.Nat }),
        Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
        BadFee: IDL.Record({ expected_fee: IDL.Nat }),
        CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
        TooOld: IDL.Null,
        InsufficientFunds: IDL.Record({ balance: IDL.Nat }),
    });
    const RejectionCode = IDL.Variant({
        NoError: IDL.Null,
        CanisterError: IDL.Null,
        SysTransient: IDL.Null,
        DestinationInvalid: IDL.Null,
        Unknown: IDL.Null,
        SysFatal: IDL.Null,
        CanisterReject: IDL.Null,
    });
    const BusinessError = IDL.Variant({
        InvalidTokenPair: IDL.Tuple(IDL.Principal, IDL.Principal),
        TransferError: TransferError,
        NotSupportedToken: IDL.Principal,
        Swap: IDL.Text,
        TokenPairAmmNotExist: IDL.Tuple(TokenPair, IDL.Text),
        InsufficientBalance: IDL.Tuple(IDL.Principal, IDL.Nat),
        TokenPairAmmExist: IDL.Tuple(TokenPair, IDL.Text),
        InvalidAmm: IDL.Text,
        Locked: IDL.Vec(TokenAccount),
        TransferFromError: TransferFromError,
        NotOwner: IDL.Principal,
        CallCanisterError: IDL.Tuple(RejectionCode, IDL.Text),
        Liquidity: IDL.Text,
        Expired: IDL.Nat64,
    });
    const BusinessResult = IDL.Variant({
        Ok: IDL.Null,
        Err: BusinessError,
    });
    const TokenPairLiquidityAddArgs = IDL.Record({
        to: Account,
        from: Account,
        pool: TokenPairPool,
        deadline: IDL.Opt(IDL.Nat64),
        amount_desired: IDL.Tuple(IDL.Nat, IDL.Nat),
        amount_min: IDL.Tuple(IDL.Nat, IDL.Nat),
    });
    const TokenPairLiquidityAddSuccess = IDL.Record({
        liquidity: IDL.Nat,
        amount: IDL.Tuple(IDL.Nat, IDL.Nat),
    });
    const TokenPairLiquidityAddResult = IDL.Variant({
        Ok: TokenPairLiquidityAddSuccess,
        Err: BusinessError,
    });
    const TokenPairLiquidityRemoveArgs = IDL.Record({
        to: Account,
        from: Account,
        pool: TokenPairPool,
        liquidity: IDL.Nat,
        deadline: IDL.Opt(IDL.Nat64),
        amount_min: IDL.Tuple(IDL.Nat, IDL.Nat),
    });
    const TokenPairLiquidityRemoveSuccess = IDL.Record({
        amount: IDL.Tuple(IDL.Nat, IDL.Nat),
    });
    const TokenPairLiquidityRemoveResult = IDL.Variant({
        Ok: TokenPairLiquidityRemoveSuccess,
        Err: BusinessError,
    });
    const InnerLP = IDL.Record({
        fee: IDL.Nat,
        decimals: IDL.Nat8,
        dummy_canister_id: IDL.Principal,
        minimum_liquidity: IDL.Nat,
        total_supply: IDL.Nat,
    });
    const OuterLP = IDL.Record({
        fee: IDL.Nat,
        decimals: IDL.Nat8,
        token_canister_id: IDL.Principal,
        minimum_liquidity: IDL.Nat,
        total_supply: IDL.Nat,
    });
    const PoolLp = IDL.Variant({ InnerLP: InnerLP, OuterLP: OuterLP });
    const SwapV2MarketMakerView = IDL.Record({
        lp: PoolLp,
        block_timestamp_last: IDL.Nat64,
        price_cumulative_unit: IDL.Nat,
        reserve0: IDL.Nat,
        reserve1: IDL.Nat,
        subaccount: IDL.Text,
        price1_cumulative_last: IDL.Nat,
        token0: IDL.Text,
        token1: IDL.Text,
        fee_rate: IDL.Text,
        k_last: IDL.Nat,
        protocol_fee: IDL.Opt(IDL.Text),
        price0_cumulative_last: IDL.Nat,
    });
    const MarketMakerView = IDL.Variant({ SwapV2: SwapV2MarketMakerView });
    const TokenPairSwapExactTokensForTokensArgs = IDL.Record({
        to: Account,
        amount_out_min: IDL.Nat,
        from: Account,
        path: IDL.Vec(TokenPairPool),
        deadline: IDL.Opt(IDL.Nat64),
        amount_in: IDL.Nat,
    });
    const TokenPairSwapTokensSuccess = IDL.Record({
        amounts: IDL.Vec(IDL.Nat),
    });
    const TokenPairSwapTokensResult = IDL.Variant({
        Ok: TokenPairSwapTokensSuccess,
        Err: BusinessError,
    });
    const TokenPairSwapTokensForExactTokensArgs = IDL.Record({
        to: Account,
        from: Account,
        path: IDL.Vec(TokenPairPool),
        deadline: IDL.Opt(IDL.Nat64),
        amount_out: IDL.Nat,
        amount_in_max: IDL.Nat,
    });
    const PauseReason = IDL.Record({
        timestamp_nanos: IDL.Int,
        message: IDL.Text,
    });
    const Permission = IDL.Variant({
        Permitted: IDL.Text,
        Forbidden: IDL.Text,
    });
    const PermissionUpdatedArg = IDL.Variant({
        UpdateRolePermission: IDL.Tuple(IDL.Text, IDL.Opt(IDL.Vec(IDL.Text))),
        UpdateUserPermission: IDL.Tuple(IDL.Principal, IDL.Opt(IDL.Vec(IDL.Text))),
        UpdateUserRole: IDL.Tuple(IDL.Principal, IDL.Opt(IDL.Vec(IDL.Text))),
    });
    const QueryPage = IDL.Record({ page: IDL.Nat64, size: IDL.Nat32 });
    const RecordSearchArg = IDL.Record({
        id: IDL.Opt(IDL.Tuple(IDL.Opt(IDL.Nat64), IDL.Opt(IDL.Nat64))),
        created: IDL.Opt(IDL.Tuple(IDL.Opt(IDL.Nat64), IDL.Opt(IDL.Nat64))),
        topic: IDL.Opt(IDL.Vec(IDL.Text)),
        content: IDL.Opt(IDL.Text),
        caller: IDL.Opt(IDL.Vec(IDL.Principal)),
    });
    const Record = IDL.Record({
        id: IDL.Nat64,
        created: IDL.Int,
        topic: IDL.Nat8,
        content: IDL.Text,
        done: IDL.Opt(IDL.Tuple(IDL.Int, IDL.Text)),
        caller: IDL.Principal,
    });
    const PageData = IDL.Record({
        total: IDL.Nat64,
        data: IDL.Vec(Record),
        page: IDL.Nat64,
        size: IDL.Nat32,
    });
    const MigratedRecords = IDL.Record({
        records: IDL.Vec(Record),
        next_id: IDL.Nat64,
        removed: IDL.Nat64,
    });
    const TokenDepositArgs = IDL.Record({
        token: IDL.Principal,
        from: Account,
        amount_without_fee: IDL.Nat,
    });
    const TokenTransferResult = IDL.Variant({
        Ok: IDL.Nat,
        Err: BusinessError,
    });
    const TokenInfo = IDL.Record({
        fee: IDL.Nat,
        decimals: IDL.Nat8,
        name: IDL.Text,
        canister_id: IDL.Principal,
        symbol: IDL.Text,
    });
    const TokenWithdrawArgs = IDL.Record({
        to: Account,
        token: IDL.Principal,
        from: Account,
        amount_without_fee: IDL.Nat,
    });
    return IDL.Service({
        __get_candid_interface_tmp_hack: IDL.Func([], [IDL.Text], ['query']),
        business_example_cell_query: IDL.Func([], [IDL.Text], ['query']),
        business_example_cell_set: IDL.Func([IDL.Text], [], []),
        business_example_log_query: IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
        business_example_log_update: IDL.Func([IDL.Text], [IDL.Nat64], []),
        business_example_map_query: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat64, IDL.Text))], ['query']),
        business_example_map_update: IDL.Func([IDL.Nat64, IDL.Opt(IDL.Text)], [IDL.Opt(IDL.Text)], []),
        business_example_priority_queue_pop: IDL.Func([], [IDL.Opt(IDL.Nat64)], []),
        business_example_priority_queue_push: IDL.Func([IDL.Nat64], [], []),
        business_example_priority_queue_query: IDL.Func([], [IDL.Vec(IDL.Nat64)], ['query']),
        business_example_query: IDL.Func([], [IDL.Text], ['query']),
        business_example_set: IDL.Func([IDL.Text], [], []),
        business_example_vec_pop: IDL.Func([], [IDL.Opt(ExampleVec)], []),
        business_example_vec_push: IDL.Func([IDL.Nat64], [], []),
        business_example_vec_query: IDL.Func([], [IDL.Vec(ExampleVec)], ['query']),
        canister_status: IDL.Func([], [CanisterStatusResponse], []),
        pair_create: IDL.Func([TokenPairPool], [BusinessResult], []),
        pair_liquidity_add: IDL.Func([TokenPairLiquidityAddArgs, IDL.Opt(IDL.Nat8)], [TokenPairLiquidityAddResult], []),
        pair_liquidity_remove: IDL.Func(
            [TokenPairLiquidityRemoveArgs, IDL.Opt(IDL.Nat8)],
            [TokenPairLiquidityRemoveResult],
            [],
        ),
        pair_query: IDL.Func([TokenPairPool], [IDL.Opt(MarketMakerView)], ['query']),
        pair_swap_exact_tokens_for_tokens: IDL.Func(
            [TokenPairSwapExactTokensForTokensArgs, IDL.Opt(IDL.Nat8)],
            [TokenPairSwapTokensResult],
            [],
        ),
        pair_swap_tokens_for_exact_tokens: IDL.Func(
            [TokenPairSwapTokensForExactTokensArgs, IDL.Opt(IDL.Nat8)],
            [TokenPairSwapTokensResult],
            [],
        ),
        pairs_query: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenPairPool, MarketMakerView))], ['query']),
        pause_query: IDL.Func([], [IDL.Bool], ['query']),
        pause_query_reason: IDL.Func([], [IDL.Opt(PauseReason)], ['query']),
        pause_replace: IDL.Func([IDL.Opt(IDL.Text)], [], []),
        permission_all: IDL.Func([], [IDL.Vec(Permission)], ['query']),
        permission_assigned_by_user: IDL.Func([IDL.Principal], [IDL.Opt(IDL.Vec(Permission))], ['query']),
        permission_assigned_query: IDL.Func([], [IDL.Opt(IDL.Vec(Permission))], ['query']),
        permission_find_by_user: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Text)], ['query']),
        permission_query: IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
        permission_roles_all: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(Permission)))], ['query']),
        permission_roles_by_user: IDL.Func([IDL.Principal], [IDL.Opt(IDL.Vec(IDL.Text))], ['query']),
        permission_roles_query: IDL.Func([], [IDL.Opt(IDL.Vec(IDL.Text))], ['query']),
        permission_update: IDL.Func([IDL.Vec(PermissionUpdatedArg)], [], []),
        record_find_by_page: IDL.Func([QueryPage, IDL.Opt(RecordSearchArg)], [PageData], ['query']),
        record_migrate: IDL.Func([IDL.Nat32], [MigratedRecords], []),
        record_topics: IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
        schedule_find: IDL.Func([], [IDL.Opt(IDL.Nat64)], ['query']),
        schedule_replace: IDL.Func([IDL.Opt(IDL.Nat64)], [], []),
        schedule_trigger: IDL.Func([], [], []),
        test_withdraw_all_tokens: IDL.Func([IDL.Vec(IDL.Principal)], [IDL.Vec(IDL.Text)], []),
        token_balance_of: IDL.Func([IDL.Principal, Account], [IDL.Nat], ['query']),
        token_deposit: IDL.Func([TokenDepositArgs, IDL.Opt(IDL.Nat8)], [TokenTransferResult], []),
        token_query: IDL.Func([IDL.Principal], [IDL.Opt(TokenInfo)], ['query']),
        token_withdraw: IDL.Func([TokenWithdrawArgs, IDL.Opt(IDL.Nat8)], [TokenTransferResult], []),
        tokens_balance_of: IDL.Func([Account], [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))], ['query']),
        tokens_query: IDL.Func([], [IDL.Vec(TokenInfo)], ['query']),
        version: IDL.Func([], [IDL.Nat32], ['query']),
        wallet_balance: IDL.Func([], [IDL.Nat], ['query']),
        wallet_receive: IDL.Func([], [IDL.Nat], []),
        whoami: IDL.Func([], [IDL.Principal], ['query']),
    });
};
export const init = ({ IDL }) => {
    const CanisterInitialArg = IDL.Record({ schedule: IDL.Opt(IDL.Nat) });
    return [IDL.Opt(CanisterInitialArg)];
};
