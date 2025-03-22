import { useState, useEffect } from "react";
import { Input } from "../../components/ui/input";
import {useWallets} from '@privy-io/react-auth';
import { formatEther } from "ethers";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

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
          initialSupply: formatEther(token.initialAmount).replace(/\.0+$/, ''),
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
    <div className="w-full h-full p-4 md:p-6 space-y-4 md:space-y-6 opacity-85">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-white">Tokens</h1>
        <div className="w-full sm:w-auto sm:min-w-[300px]">
          <Input
            type="text"
            placeholder="Search by name, symbol, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="relative overflow-x-auto rounded-lg border">
        <div className="min-w-full overflow-x-auto">
          <table className="w-full text-sm text-left table-fixed min-w-[350px]">
            <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-4 md:px-6 py-3 w-[45%]">Token</th>
                <th scope="col" className="px-4 md:px-6 py-3 w-[40%]">Contract Address</th>
                <th scope="col" className="px-4 md:px-6 py-3 w-[15%] min-w-[60px]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTokens.map((token) => (
                <>
                  <tr 
                    key={token.contractAddress} 
                    onClick={() => setExpandedRow(expandedRow === token.contractAddress ? null : token.contractAddress)}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                  >
                    <td className="px-4 md:px-6 py-4 min-w-0">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{token.name}</div>
                          <div className="text-gray-500 truncate">{token.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 min-w-0">
                      <span className="font-mono text-xs md:text-sm truncate block">
                        {token.contractAddress}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedRow(expandedRow === token.contractAddress ? null : token.contractAddress);
                        }}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded inline-flex"
                        aria-label={expandedRow === token.contractAddress ? "Collapse" : "Expand"}
                      >
                        {expandedRow === token.contractAddress ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedRow === token.contractAddress && (
                    <tr className="bg-gray-50 dark:bg-gray-900">
                      <td colSpan={3} className="px-4 md:px-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium text-gray-500">Created At</div>
                            <div className="mt-1">{token.createdAt}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500">Initial Supply</div>
                            <div className="mt-1">{token.initialSupply}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TokensPage;
