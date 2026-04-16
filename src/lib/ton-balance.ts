export interface TokenBalance {
  name: string;
  symbol: string;
  balance: string;
  image: string;
  address: string;
}

export async function getTonBalance(address: string): Promise<string> {
  const res = await fetch(
    `https://toncenter.com/api/v2/getAddressBalance?address=${address}`
  );
  const data = await res.json();
  if (!data.ok) return '0';
  return (Number(data.result) / 1e9).toFixed(2);
}

export async function getJettonBalances(address: string): Promise<TokenBalance[]> {
  const res = await fetch(
    `https://tonapi.io/v2/accounts/${address}/jettons`
  );
  const data = await res.json();
  if (!data.balances) return [];

  return data.balances
    .filter((j: any) => Number(j.balance) > 0)
    .map((j: any) => {
      const meta = j.jetton;
      const decimals = meta.decimals ?? 9;
      const raw = Number(j.balance) / Math.pow(10, decimals);
      return {
        name: meta.name || 'Unknown',
        symbol: meta.symbol || '???',
        balance: raw < 0.01 ? raw.toFixed(6) : raw.toFixed(2),
        image: meta.image || '',
        address: meta.address,
      };
    });
}
