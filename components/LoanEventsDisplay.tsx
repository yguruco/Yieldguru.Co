import { useState } from "react";
import { useWatchContractEvent } from "wagmi";
import { loanFactoryABI, loanFactoryAddress } from "@/contractsAbi/LoanFactory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEther } from "viem";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoanEvent {
  loanAddress: string;
  borrower: string;
  amount: bigint;
  time: bigint;
  logId: string; 
}

export function LoanEventsDisplay({ onNewLoanAddress }: { onNewLoanAddress?: (address: string) => void }) {
  const [events, setEvents] = useState<LoanEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const manualRefresh = () => {
    setIsLoading(true);
    // This is just visual feedback since useWatchContractEvent doesn't have a manual refresh
    // We'll hide the loading indicator after a short delay
    setTimeout(() => setIsLoading(false), 1000);
  };

  useWatchContractEvent({
    address: loanFactoryAddress as `0x${string}`,
    abi: loanFactoryABI,
    eventName: "LoanCreated",
    pollingInterval: 5000,
    onLogs(logs) {
      console.log("New logs:", logs);
      const newEvents = logs.map(log => ({
        loanAddress: log.args.loanAddress as string,
        borrower: log.args.borrower as string,
        amount: log.args.amount as bigint,
        time: log.args.time as bigint,
        logId: `${log.blockHash}-${log.logIndex}` // Unique ID for key
      }));
      
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
    },
    onError(error) {
      console.error("Error watching LoanCreated event:", error);
      setError("Failed to watch for loan events. Please refresh or try again later.");
    }
  });

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
          onClick={manualRefresh} 
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