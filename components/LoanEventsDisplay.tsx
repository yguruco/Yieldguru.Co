import { useState, useEffect } from "react";
import { usePublicClient } from "wagmi";
import { loanFactoryABI, loanFactoryAddress } from "@/contractsAbi/LoanFactory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEther } from "viem";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Component to display loan creation events from the LoanFactory contract
 * Uses a more stable approach than event filters which were failing
 */
export function LoanEventsDisplay({ onNewLoanAddress }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const publicClient = usePublicClient();
  
  // Function to fetch events manually instead of using filters which were failing
  const fetchLoanEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the current block number
      const blockNumber = await publicClient.getBlockNumber();
      
      // Fetch events from the last 1000 blocks or a reasonable number
      // Adjust this value based on your chain's block time and expected event frequency
      const fromBlock = blockNumber - 1000n > 0n ? blockNumber - 1000n : 0n;
      
      const logs = await publicClient.getLogs({
        address: loanFactoryAddress,
        event: {
          type: 'event',
          name: 'LoanCreated',
          inputs: [
            { type: 'address', name: 'loanAddress', indexed: true },
            { type: 'address', name: 'borrower', indexed: true },
            { type: 'uint256', name: 'amount' },
            { type: 'uint256', name: 'time' }
          ]
        },
        fromBlock,
        toBlock: blockNumber
      });
      
      console.log("Fetched logs:", logs);
      
      // Process the events
      const newEvents = logs.map(log => {
        const { args } = publicClient.decodeEventLog({
          abi: loanFactoryABI,
          data: log.data,
          topics: log.topics,
          eventName: 'LoanCreated'
        });
        
        return {
          loanAddress: args.loanAddress,
          borrower: args.borrower,
          amount: args.amount,
          time: args.time,
          logId: `${log.blockHash}-${log.logIndex}`
        };
      });
      
      // Update events and sort from newest to oldest
      setEvents(prevEvents => {
        // Combine old and new events, remove duplicates by logId
        const combinedEvents = [...newEvents, ...prevEvents];
        const uniqueEvents = Array.from(
          new Map(combinedEvents.map(event => [event.logId, event])).values()
        );
        // Sort by time descending and take first 10
        return uniqueEvents
          .sort((a, b) => Number(b.time - a.time))
          .slice(0, 10);
      });
      
      // Notify about the newest loan if callback provided
      if (onNewLoanAddress && newEvents.length > 0) {
        onNewLoanAddress(newEvents[0].loanAddress);
      }
    } catch (err) {
      console.error("Error fetching loan events:", err);
      setError("Failed to fetch loan events. Please refresh or try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Set up polling to fetch events regularly instead of using filters
  useEffect(() => {
    // Fetch events immediately when component mounts
    fetchLoanEvents();
    
    // Then set up a polling interval to fetch regularly
    const interval = setInterval(fetchLoanEvents, 15000); // Poll every 15 seconds
    
    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [publicClient]); // Re-initialize if the client changes
  
  // Handle manual refresh
  const handleRefresh = () => {
    fetchLoanEvents();
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Loan Creation Events</CardTitle>
          <CardDescription>Recent loan creation activity.</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <InfoIcon className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">{error}</AlertDescription>
          </Alert>
        )}
        
        {events.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="h-8 w-8 animate-spin text-[#f68b27]" />
                <p>Loading events...</p>
              </div>
            ) : (
              <p>No loan creation events found. Create a loan to see events here.</p>
            )}
          </div>
        ) : (
          <ul className="space-y-3">
            {events.map((event) => (
              <li key={event.logId} className="p-3 bg-muted rounded-md text-xs">
                <p><strong>New Loan:</strong> <span className="font-mono break-all">{event.loanAddress}</span></p>
                <p>Borrower: <span className="font-mono break-all">{event.borrower}</span></p>
                <p>Amount: {formatEther(event.amount)} ETH</p>
                <p>Time: {new Date(Number(event.time) * 1000).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}