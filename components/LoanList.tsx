import { useReadContract } from "wagmi";
import { loanFactoryABI , loanFactoryAddress} from "@/contractsAbi/LoanFactory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react"; 

export function LoanList() {
  const { data: loans, isLoading, error, refetch } = useReadContract({
    address:loanFactoryAddress as `0x${string}`,
    abi: loanFactoryABI,
    functionName: "getAllLoans",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Existing Loans</CardTitle>
        <CardDescription>List of all created loan contract addresses.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <p>Loading loans...</p>}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Fetching Loans</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        {loans && loans.length === 0 && <p>No loans created yet.</p>}
        {loans && loans.length > 0 && (
          <ul className="space-y-2">
            {(loans as string[]).map((loanAddress, index) => (
              <li key={index} className="text-sm p-2 bg-muted rounded-md font-mono break-all">
                {loanAddress}
              </li>
            ))}
          </ul>
        )}
        <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-4">Refresh List</Button>
      </CardContent>
    </Card>
  );
} 