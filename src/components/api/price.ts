export interface IcTokenPrice {
    canister_id: string;
    price?: string;
    price_change_24h?: string;
}

export const get_token_price_ic = async (): Promise<IcTokenPrice[]> => {
    const response = await fetch('https://api.kongswap.io/api/tokens?page=1&limit=1000');
    const json = await response.json();
    const items = json.items as {
        canister_id: string;
        metrics: {
            price: string;
            price_change_24h: string | null;
        };
    }[];
    return items.map((item) => ({
        canister_id: item.canister_id,
        price: item.metrics.price,
        price_change_24h: item.metrics.price_change_24h ?? undefined,
    }));
};

export const get_token_price_ic_by_canister_id = async (canister_id: string): Promise<IcTokenPrice | undefined> => {
    const response = await fetch('https://api.kongswap.io/api/tokens/by_canister', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ canister_ids: [canister_id] }),
    });
    const json = await response.json();

    const item = json.items[0] as
        | {
              canister_id: string;
              metrics: {
                  price: string;
                  price_change_24h: string | null;
              };
          }
        | undefined;

    if (!item) return undefined;
    return {
        canister_id: item.canister_id,
        price: item.metrics.price,
        price_change_24h: item.metrics.price_change_24h ?? undefined,
    };
};
