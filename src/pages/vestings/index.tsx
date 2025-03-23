import { useState, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { useWallets } from '@privy-io/react-auth';
import { ChevronDown, ChevronUp, CircleX, ExternalLink } from "lucide-react";
import { API_BASE_URL } from "@/config";

interface Vesting {
  tokenName: string;
  tokenSymbol: string;
  createdAt: string;
  tokenAddress: string;
  vestingAddress: string;
  webpage: string;
}

interface ApiVesting {
  id: string;
  blockTimestamp: string;
  token_name: string;
  token_symbol: string;
  token_address: string;
  vesting_address: string;
  webpage: string;
}

const VestingsPage = () => {
  const { wallets } = useWallets();
  const embeddedWallet = wallets?.[0];
  const [vestings, setVestings] = useState<Vesting[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    const fetchVestings = async () => {
      if (!embeddedWallet?.address) {
        setError("Please connect your wallet first");
        return;
      }
      
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/user/vestings/${embeddedWallet.address}`);
        if(response.status === 404) {
          setVestings([]);
          return;
        }
        if (!response.ok) {
          throw new Error('Failed to fetch vestings');
        }
        const apiData: ApiVesting[] = await response.json();
        const formattedVestings: Vesting[] = apiData.map(vesting => ({
          tokenName: vesting.token_name,
          tokenSymbol: vesting.token_symbol,
          createdAt: new Date(parseInt(vesting.blockTimestamp) * 1000).toLocaleDateString(),
          tokenAddress: vesting.token_address,
          vestingAddress: vesting.vesting_address,
          webpage: vesting.webpage
        }));
        setVestings(formattedVestings);
      } catch (error) {
        console.error('Error fetching vestings:', error);
        setError("Failed to fetch vestings. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVestings();
  }, [embeddedWallet?.address]);

  const filteredVestings = vestings.filter(vesting => 
    vesting.tokenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vesting.tokenSymbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vesting.tokenAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vesting.vestingAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg">Loading vestings...</div>
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

  if (vestings.length === 0 && !error) {
    return (
      <div className="w-full h-full p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-white">Vestings</h1>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 p-8 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <CircleX className="w-8 h-8 text-gray-400" />
          </div>
          <div className="text-xl font-semibold text-center">No vestings found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 md:p-6 space-y-4 md:space-y-6 opacity-85">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-white">Vestings</h1>
        <div className="w-full sm:w-auto sm:min-w-[300px]">
          <Input
            type="text"
            placeholder="Search by token name, symbol, or addresses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="relative overflow-x-auto rounded-lg border">
        <div className="min-w-full overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[800px]">
            <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-4 md:px-6 py-3">Token</th>
                <th scope="col" className="px-4 md:px-6 py-3">Created At</th>
                <th scope="col" className="px-4 md:px-6 py-3">Token Address</th>
                <th scope="col" className="px-4 md:px-6 py-3">Vesting Address</th>
                <th scope="col" className="px-4 md:px-6 py-3">Webpage</th>
                <th scope="col" className="px-4 md:px-6 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filteredVestings.length > 0 ? (
                filteredVestings.map((vesting) => (
                  <>
                    <tr 
                      key={vesting.vestingAddress} 
                      onClick={() => setExpandedRow(expandedRow === vesting.vestingAddress ? null : vesting.vestingAddress)}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                    >
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
                          <div>
                            <div className="font-medium">{vesting.tokenName}</div>
                            <div className="text-gray-500">{vesting.tokenSymbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">{vesting.createdAt}</td>
                      <td className="px-4 md:px-6 py-4">
                        <span className="font-mono text-xs truncate block max-w-[150px]" title={vesting.tokenAddress}>
                          {vesting.tokenAddress}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className="font-mono text-xs truncate block max-w-[150px]" title={vesting.vestingAddress}>
                          {vesting.vestingAddress}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        {vesting.webpage && (
                          <a
                            href={vesting.webpage}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-500 hover:text-blue-600 inline-flex items-center gap-1"
                          >
                            View <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedRow(expandedRow === vesting.vestingAddress ? null : vesting.vestingAddress);
                          }}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded inline-flex"
                          aria-label={expandedRow === vesting.vestingAddress ? "Collapse" : "Expand"}
                        >
                          {expandedRow === vesting.vestingAddress ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedRow === vesting.vestingAddress && (
                      <tr className="bg-gray-50 dark:bg-gray-900">
                        <td colSpan={6} className="px-4 md:px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm font-medium text-gray-500">Token Address</div>
                              <div className="mt-1 font-mono break-all">{vesting.tokenAddress}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-500">Vesting Address</div>
                              <div className="mt-1 font-mono break-all">{vesting.vestingAddress}</div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 md:px-6 py-4 text-center">
                    <div className="text-lg">No vestings found</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VestingsPage;
