export const idlFactory = ({ IDL }) => {
    const InitArg = IDL.Record({
        maintainers: IDL.Opt(IDL.Vec(IDL.Principal)),
        schedule: IDL.Opt(IDL.Nat),
    });
    const InitArgs = IDL.Variant({ V0: InitArg, V1: InitArg });
    const Account = IDL.Record({
        owner: IDL.Principal,
        subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    });
    const Amm = IDL.Variant({
        'swap_v2_1%': IDL.Null,
        'swap_v2_0.05%': IDL.Null,
        'swap_v2_0.3%': IDL.Null,
    });
    const PairSwapToken = IDL.Record({
        to: Account,
        amm: Amm,
        token_a: IDL.Principal,
        token_b: IDL.Principal,
        from: Account,
        amount_a: IDL.Nat,
        amount_b: IDL.Nat,
    });
    const TokenPair = IDL.Record({
        token0: IDL.Principal,
        token1: IDL.Principal,
    });
    const TokenPairAmm = IDL.Record({ amm: Amm, pair: TokenPair });
    const SwapV2BurnToken = IDL.Record({
        pa: TokenPairAmm,
        to: Account,
        token: IDL.Principal,
        from: Account,
        amount0: IDL.Nat,
        amount1: IDL.Nat,
        token0: IDL.Principal,
        token1: IDL.Principal,
        amount: IDL.Nat,
    });
    const SwapV2MintFeeToken = IDL.Record({
        pa: TokenPairAmm,
        to: Account,
        token: IDL.Principal,
        amount: IDL.Nat,
    });
    const PairCumulativePrice = IDL.Record({
        pa: TokenPairAmm,
        price_cumulative_exponent: IDL.Nat8,
        price0_cumulative: IDL.Nat,
        block_timestamp: IDL.Nat64,
        price1_cumulative: IDL.Nat,
    });
    const SwapV2Operation = IDL.Variant({
        burn: SwapV2BurnToken,
        mint: SwapV2BurnToken,
        mint_fee: SwapV2MintFeeToken,
        cumulative_price: PairCumulativePrice,
    });
    const PairCreate = IDL.Record({
        pa: TokenPairAmm,
        creator: IDL.Principal,
    });
    const PairOperation = IDL.Variant({
        swap: PairSwapToken,
        swap_v2: SwapV2Operation,
        create: PairCreate,
    });
    const SwapOperation = IDL.Variant({ pair: PairOperation });
    const SwapTransaction = IDL.Record({
        created: IDL.Opt(IDL.Nat64),
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        operation: SwapOperation,
    });
    const SwapBlock = IDL.Record({
        transaction: SwapTransaction,
        timestamp: IDL.Nat64,
        parent_hash: IDL.Vec(IDL.Nat8),
    });
    const QuerySwapBlockResult = IDL.Variant({
        archive: IDL.Principal,
        block: SwapBlock,
    });
    const DepositToken = IDL.Record({
        to: Account,
        token: IDL.Principal,
        from: Account,
        amount: IDL.Nat,
    });
    const TransferFee = IDL.Record({ fee: IDL.Nat, fee_to: Account });
    const TransferToken = IDL.Record({
        to: Account,
        fee: IDL.Opt(TransferFee),
        token: IDL.Principal,
        from: Account,
        amount: IDL.Nat,
    });
    const TokenOperation = IDL.Variant({
        withdraw: DepositToken,
        deposit: DepositToken,
        transfer: TransferToken,
    });
    const TokenTransaction = IDL.Record({
        created: IDL.Opt(IDL.Nat64),
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        operation: TokenOperation,
    });
    const TokenBlock = IDL.Record({
        transaction: TokenTransaction,
        timestamp: IDL.Nat64,
        parent_hash: IDL.Vec(IDL.Nat8),
    });
    const QueryTokenBlockResult = IDL.Variant({
        archive: IDL.Principal,
        block: TokenBlock,
    });
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
        token0: IDL.Principal,
        token1: IDL.Principal,
    });
    const TokenPairCreateArgs = IDL.Record({
        created: IDL.Opt(IDL.Nat64),
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        pool: TokenPairPool,
    });
    const OuterLP = IDL.Record({
        fee: IDL.Nat,
        decimals: IDL.Nat8,
        token_canister_id: IDL.Principal,
        minimum_liquidity: IDL.Nat,
        total_supply: IDL.Nat,
    });
    const InnerLP = IDL.Record({
        fee: IDL.Nat,
        decimals: IDL.Nat8,
        dummy_canister_id: IDL.Principal,
        minimum_liquidity: IDL.Nat,
        total_supply: IDL.Nat,
    });
    const PoolLp = IDL.Variant({ outer: OuterLP, inner: InnerLP });
    const SwapV2MarketMakerView = IDL.Record({
        lp: PoolLp,
        price_cumulative_exponent: IDL.Nat8,
        block_timestamp_last: IDL.Nat64,
        reserve0: IDL.Text,
        reserve1: IDL.Text,
        subaccount: IDL.Text,
        price1_cumulative_last: IDL.Text,
        token0: IDL.Text,
        token1: IDL.Text,
        fee_rate: IDL.Text,
        k_last: IDL.Text,
        protocol_fee: IDL.Opt(IDL.Text),
        price0_cumulative_last: IDL.Text,
    });
    const MarketMakerView = IDL.Variant({ swap_v2: SwapV2MarketMakerView });
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
        TokenBlockChainLocked: IDL.Null,
        TransferError: TransferError,
        NotSupportedToken: IDL.Principal,
        Swap: IDL.Text,
        TokenPairAmmNotExist: TokenPairAmm,
        TokenAccountsLocked: IDL.Vec(TokenAccount),
        MemoTooLong: IDL.Null,
        InsufficientBalance: IDL.Record({
            token: IDL.Principal,
            balance: IDL.Nat,
        }),
        TokenPairAmmExist: TokenPairAmm,
        RequestTraceLocked: IDL.Text,
        InvalidCreated: IDL.Record({
            created: IDL.Nat64,
            system: IDL.Nat64,
        }),
        InvalidAmm: IDL.Text,
        InvalidTransferFee: IDL.Record({
            fee: IDL.Nat,
            token: IDL.Principal,
        }),
        SwapBlockChainLocked: IDL.Null,
        TokenBlockChainError: IDL.Text,
        TransferFromError: TransferFromError,
        TokenAccountsUnlocked: IDL.Vec(TokenAccount),
        NotOwner: IDL.Principal,
        SwapBlockChainError: IDL.Text,
        CallCanisterError: IDL.Tuple(RejectionCode, IDL.Text),
        Liquidity: IDL.Text,
        Expired: IDL.Record({ deadline: IDL.Nat64, system: IDL.Nat64 }),
    });
    const TokenPairCreateResult = IDL.Variant({
        Ok: MarketMakerView,
        Err: BusinessError,
    });
    const SwapTokenPair = IDL.Record({
        amm: IDL.Text,
        token: IDL.Tuple(IDL.Principal, IDL.Principal),
    });
    const TokenPairLiquidityAddArgs = IDL.Record({
        to: Account,
        created: IDL.Opt(IDL.Nat64),
        from: Account,
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        deadline: IDL.Opt(IDL.Nat64),
        amount_desired: IDL.Tuple(IDL.Nat, IDL.Nat),
        amount_min: IDL.Tuple(IDL.Nat, IDL.Nat),
        swap_pair: SwapTokenPair,
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
        created: IDL.Opt(IDL.Nat64),
        from: Account,
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        liquidity: IDL.Nat,
        deadline: IDL.Opt(IDL.Nat64),
        amount_min: IDL.Tuple(IDL.Nat, IDL.Nat),
        swap_pair: SwapTokenPair,
    });
    const TokenPairLiquidityRemoveSuccess = IDL.Record({
        amount: IDL.Tuple(IDL.Nat, IDL.Nat),
    });
    const TokenPairLiquidityRemoveResult = IDL.Variant({
        Ok: TokenPairLiquidityRemoveSuccess,
        Err: BusinessError,
    });
    const TokenPairSwapByLoanArgs = IDL.Record({
        to: Account,
        created: IDL.Opt(IDL.Nat64),
        from: Account,
        loan: IDL.Nat,
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        path: IDL.Vec(SwapTokenPair),
        deadline: IDL.Opt(IDL.Nat64),
    });
    const TokenPairSwapTokensSuccess = IDL.Record({
        amounts: IDL.Vec(IDL.Nat),
    });
    const TokenPairSwapTokensResult = IDL.Variant({
        Ok: TokenPairSwapTokensSuccess,
        Err: BusinessError,
    });
    const TokenPairSwapExactTokensForTokensArgs = IDL.Record({
        to: Account,
        created: IDL.Opt(IDL.Nat64),
        amount_out_min: IDL.Nat,
        from: Account,
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        path: IDL.Vec(SwapTokenPair),
        deadline: IDL.Opt(IDL.Nat64),
        amount_in: IDL.Nat,
    });
    const TokenPairSwapTokensForExactTokensArgs = IDL.Record({
        to: Account,
        created: IDL.Opt(IDL.Nat64),
        from: Account,
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        path: IDL.Vec(SwapTokenPair),
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
    const TokenDepositArgWithMeta = IDL.Record({
        arg: DepositToken,
        now: IDL.Nat64,
        created: IDL.Opt(IDL.Nat64),
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        caller: IDL.Principal,
    });
    const PairCreateArgWithMeta = IDL.Record({
        arg: TokenPairAmm,
        now: IDL.Nat64,
        created: IDL.Opt(IDL.Nat64),
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        caller: IDL.Principal,
    });
    const TokenPairSwapExactTokensForTokensArg = IDL.Record({
        to: Account,
        pas: IDL.Vec(TokenPairAmm),
        self_canister: IDL.Principal,
        amount_out_min: IDL.Nat,
        from: Account,
        path: IDL.Vec(SwapTokenPair),
        amount_in: IDL.Nat,
    });
    const PairSwapExactTokensForTokensArgWithMeta = IDL.Record({
        arg: TokenPairSwapExactTokensForTokensArg,
        now: IDL.Nat64,
        created: IDL.Opt(IDL.Nat64),
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        caller: IDL.Principal,
    });
    const TokenPairLiquidityAddArg = IDL.Record({
        pa: TokenPairAmm,
        to: Account,
        amount_a_min: IDL.Nat,
        token_a: IDL.Principal,
        token_b: IDL.Principal,
        self_canister: IDL.Principal,
        from: Account,
        amount_b_desired: IDL.Nat,
        amount_a_desired: IDL.Nat,
        amount_b_min: IDL.Nat,
    });
    const PairLiquidityAddArgWithMeta = IDL.Record({
        arg: TokenPairLiquidityAddArg,
        now: IDL.Nat64,
        created: IDL.Opt(IDL.Nat64),
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        caller: IDL.Principal,
    });
    const TokenTransferArgWithMeta = IDL.Record({
        arg: TransferToken,
        now: IDL.Nat64,
        created: IDL.Opt(IDL.Nat64),
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        caller: IDL.Principal,
    });
    const TokenPairSwapByLoanArg = IDL.Record({
        to: Account,
        pas: IDL.Vec(TokenPairAmm),
        self_canister: IDL.Principal,
        from: Account,
        loan: IDL.Nat,
        path: IDL.Vec(SwapTokenPair),
    });
    const PairSwapByLoanArgWithMeta = IDL.Record({
        arg: TokenPairSwapByLoanArg,
        now: IDL.Nat64,
        created: IDL.Opt(IDL.Nat64),
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        caller: IDL.Principal,
    });
    const TokenPairLiquidityRemoveArg = IDL.Record({
        pa: TokenPairAmm,
        to: Account,
        amount_a_min: IDL.Nat,
        token_a: IDL.Principal,
        token_b: IDL.Principal,
        self_canister: IDL.Principal,
        from: Account,
        liquidity: IDL.Nat,
        amount_b_min: IDL.Nat,
    });
    const PairLiquidityRemoveArgWithMeta = IDL.Record({
        arg: TokenPairLiquidityRemoveArg,
        now: IDL.Nat64,
        created: IDL.Opt(IDL.Nat64),
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        caller: IDL.Principal,
    });
    const TokenPairSwapTokensForExactTokensArg = IDL.Record({
        to: Account,
        pas: IDL.Vec(TokenPairAmm),
        self_canister: IDL.Principal,
        from: Account,
        path: IDL.Vec(SwapTokenPair),
        amount_out: IDL.Nat,
        amount_in_max: IDL.Nat,
    });
    const PairSwapTokensForExactTokensArgWithMeta = IDL.Record({
        arg: TokenPairSwapTokensForExactTokensArg,
        now: IDL.Nat64,
        created: IDL.Opt(IDL.Nat64),
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        caller: IDL.Principal,
    });
    const RequestArgs = IDL.Variant({
        token_deposit: TokenDepositArgWithMeta,
        pair_create: PairCreateArgWithMeta,
        pair_swap_exact_tokens_for_tokens: PairSwapExactTokensForTokensArgWithMeta,
        pair_liquidity_add: PairLiquidityAddArgWithMeta,
        token_transfer: TokenTransferArgWithMeta,
        pair_swap_by_loan: PairSwapByLoanArgWithMeta,
        pair_liquidity_remove: PairLiquidityRemoveArgWithMeta,
        pair_swap_tokens_for_exact_tokens: PairSwapTokensForExactTokensArgWithMeta,
        token_withdraw: TokenDepositArgWithMeta,
    });
    const Result = IDL.Variant({ Ok: IDL.Text, Err: IDL.Text });
    const BusinessLocks = IDL.Record({
        token: IDL.Opt(IDL.Bool),
        swap: IDL.Opt(IDL.Bool),
        balances: IDL.Opt(IDL.Vec(TokenAccount)),
    });
    const RequestTrace = IDL.Record({
        args: RequestArgs,
        done: IDL.Opt(IDL.Tuple(IDL.Nat64, Result)),
        traces: IDL.Vec(IDL.Tuple(IDL.Nat64, IDL.Text)),
        locks: BusinessLocks,
        index: IDL.Nat64,
    });
    const TokenDepositArgs = IDL.Record({
        to: Account,
        created: IDL.Opt(IDL.Nat64),
        token: IDL.Principal,
        from: Account,
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        deposit_amount_without_fee: IDL.Nat,
    });
    const TokenChangedResult = IDL.Variant({
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
    const TokenTransferArgs = IDL.Record({
        to: Account,
        fee: IDL.Opt(IDL.Nat),
        created: IDL.Opt(IDL.Nat64),
        token: IDL.Principal,
        from: Account,
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        transfer_amount_without_fee: IDL.Nat,
    });
    const TokenWithdrawArgs = IDL.Record({
        to: Account,
        created: IDL.Opt(IDL.Nat64),
        token: IDL.Principal,
        from: Account,
        memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        withdraw_amount_without_fee: IDL.Nat,
    });
    return IDL.Service({
        __get_candid_interface_tmp_hack: IDL.Func([], [IDL.Text], ['query']),
        block_swap_get: IDL.Func([IDL.Nat64], [QuerySwapBlockResult], ['query']),
        block_token_get: IDL.Func([IDL.Nat64], [QueryTokenBlockResult], ['query']),
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
        config_fee_to_query: IDL.Func([], [IDL.Opt(Account)], []),
        config_fee_to_replace: IDL.Func([IDL.Opt(Account)], [IDL.Opt(Account)], []),
        pair_create: IDL.Func([TokenPairCreateArgs], [TokenPairCreateResult], []),
        pair_liquidity_add: IDL.Func([TokenPairLiquidityAddArgs, IDL.Opt(IDL.Nat8)], [TokenPairLiquidityAddResult], []),
        pair_liquidity_remove: IDL.Func(
            [TokenPairLiquidityRemoveArgs, IDL.Opt(IDL.Nat8)],
            [TokenPairLiquidityRemoveResult],
            [],
        ),
        pair_query: IDL.Func([TokenPairPool], [IDL.Opt(MarketMakerView)], ['query']),
        pair_swap_by_loan: IDL.Func([TokenPairSwapByLoanArgs, IDL.Opt(IDL.Nat8)], [TokenPairSwapTokensResult], []),
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
        request_trace_get: IDL.Func([IDL.Nat64], [IDL.Opt(RequestTrace)], []),
        request_trace_index_get: IDL.Func([], [IDL.Nat64, IDL.Nat64], []),
        request_trace_remove: IDL.Func([IDL.Nat64], [IDL.Opt(RequestTrace)], []),
        schedule_find: IDL.Func([], [IDL.Opt(IDL.Nat64)], ['query']),
        schedule_replace: IDL.Func([IDL.Opt(IDL.Nat64)], [], []),
        schedule_trigger: IDL.Func([], [], []),
        test_withdraw_all_tokens: IDL.Func([IDL.Vec(IDL.Principal)], [IDL.Vec(IDL.Text)], []),
        token_balance: IDL.Func([IDL.Principal, IDL.Opt(IDL.Vec(IDL.Nat8))], [IDL.Nat], ['query']),
        token_balance_by: IDL.Func([IDL.Principal, Account], [IDL.Nat], ['query']),
        token_balance_of: IDL.Func([IDL.Principal, Account], [IDL.Nat], ['query']),
        token_deposit: IDL.Func([TokenDepositArgs, IDL.Opt(IDL.Nat8)], [TokenChangedResult], []),
        token_query: IDL.Func([IDL.Principal], [IDL.Opt(TokenInfo)], ['query']),
        token_transfer: IDL.Func([TokenTransferArgs, IDL.Opt(IDL.Nat8)], [TokenChangedResult], []),
        token_withdraw: IDL.Func([TokenWithdrawArgs, IDL.Opt(IDL.Nat8)], [TokenChangedResult], []),
        tokens_balance: IDL.Func([IDL.Opt(IDL.Vec(IDL.Nat8))], [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))], ['query']),
        tokens_balance_by: IDL.Func([Account], [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))], ['query']),
        tokens_balance_of: IDL.Func([Account], [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))], ['query']),
        tokens_query: IDL.Func([], [IDL.Vec(TokenInfo)], ['query']),
        version: IDL.Func([], [IDL.Nat32], ['query']),
        wallet_balance: IDL.Func([], [IDL.Nat], ['query']),
        wallet_receive: IDL.Func([], [IDL.Nat], []),
        whoami: IDL.Func([], [IDL.Principal], ['query']),
    });
};
export const init = ({ IDL }) => {
    const InitArg = IDL.Record({
        maintainers: IDL.Opt(IDL.Vec(IDL.Principal)),
        schedule: IDL.Opt(IDL.Nat),
    });
    const InitArgs = IDL.Variant({ V0: InitArg, V1: InitArg });
    return [IDL.Opt(InitArgs)];
};
