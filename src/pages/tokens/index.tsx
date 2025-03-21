import { useState, useEffect } from "react";
import { Input } from "../../components/ui/input";
import {useWallets} from '@privy-io/react-auth';
import { formatEther } from "ethers";

interface Token {
  name: string;
  symbol: string;
  createdAt: string;
  initialSupply: string;
  contractAddress: string;
} 

interface ApiToken {
  id: string;
  blockTimestamp: string;
  initialAmount: string;
  name: string;
  ticker: string;
  owner: string;
  token_address: string;
}

const TokensPage = () => {
  const { wallets } = useWallets();
  console.log({wallets});
  const embeddedWallet = wallets?.[0];
  const [tokens, setTokens] = useState<Token[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      if (!embeddedWallet?.address) {
        setError("Please connect your wallet first");
        return;
      }
      
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api-production-a609.up.railway.app/api/user/tokens/0x25Fbb765998134400f6e2D4191e89C37dB40fa98`);
        if (!response.ok) {
          throw new Error('Failed to fetch tokens');
        }
        const apiData: ApiToken[] = await response.json();
        const formattedTokens: Token[] = apiData.map(token => ({
          name: token.name,
          symbol: token.ticker,
          createdAt: new Date(parseInt(token.blockTimestamp) * 1000).toLocaleDateString(),
          initialSupply: formatEther(token.initialAmount),
          contractAddress: token.token_address
        }));
        setTokens(formattedTokens);
      } catch (error) {
        console.error('Error fetching tokens:', error);
        setError("Failed to fetch tokens. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, [embeddedWallet?.address]);

  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.contractAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg">Loading tokens...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  if (tokens.length === 0 && !error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg">No tokens found</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-6 space-y-6 opacity-85">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-white">Tokens</h1>
      </div>

      <div className="w-full max-w-xs">
        <Input
          type="text"
          placeholder="Search by name, symbol, or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="relative overflow-x-auto rounded-lg border">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">Token</th>
              <th scope="col" className="px-6 py-3">Created At</th>
              <th scope="col" className="px-6 py-3">Initial Supply</th>
              <th scope="col" className="px-6 py-3">Contract Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredTokens.map((token, index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="font-medium">{token.name}</div>
                      <div className="text-gray-500">{token.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{token.createdAt}</td>
                <td className="px-6 py-4">{token.initialSupply}</td>
                <td className="px-6 py-4">
                  <span className="font-mono text-sm">{token.contractAddress}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TokensPage;
