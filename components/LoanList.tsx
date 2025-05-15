import { useEffect, useRef, useState } from "react";
import { useReadContract } from "wagmi";
import { loanFactoryABI, loanFactoryAddress } from "@/contractsAbi/LoanFactory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export function LoanList() {
  const { data: loans, isLoading, error, refetch } = useReadContract({
    address: loanFactoryAddress as `0x${string}`,
    abi: loanFactoryABI,
    functionName: "getAllLoans",
  });

  const [newAddress, setNewAddress] = useState<string | null>(null);
  const previousLoansRef = useRef<string[]>([]);

  useEffect(() => {
    if (Array.isArray(loans)) {
      const prev = previousLoansRef.current;
      if (loans.length > prev.length) {
        const newOnes = loans.filter((addr) => !prev.includes(addr));
        if (newOnes.length > 0) {
          setNewAddress(newOnes[newOnes.length - 1]);
        }
      }
      previousLoansRef.current = [...loans].reverse(); // Store in reverse order to track newest first
    }
  }, [loans]);

  // Clear the highlight effect after some time
  useEffect(() => {
    if (newAddress) {
      const timer = setTimeout(() => {
        setNewAddress(null);
      }, 15000); // Show highlight for 15 seconds
      
      return () => clearTimeout(timer);
    }
  }, [newAddress]);

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
        {loans && (loans as string[]).length === 0 && <p>No loans created yet.</p>}
        {loans && (loans as string[]).length > 0 && (
          <ul className="space-y-2">
            {/* Display the new address at the top if it exists */}
            {newAddress && (
              <motion.li
                key={newAddress}
                initial={{ backgroundColor: "#f0fdf4", y: -20, opacity: 0 }}
                animate={{ backgroundColor: "#dcfce7", y: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.5,
                  backgroundColor: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 1.5
                  }
                }}
                className="text-sm p-2 border border-green-400 rounded-md font-mono break-all flex items-center space-x-2"
              >
                <span className="text-green-600 font-bold">➤</span>
                <a
                  href={`https://sepolia.basescan.org/address/${newAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 font-semibold hover:underline"
                >
                  {newAddress}
                </a>
              </motion.li>
            )}
            
            {/* Display other loans (excluding the new address) in reverse order */}
            {(loans as string[])
              .filter(addr => addr !== newAddress)
              .reverse() // Show newest loans at the top
              .map((loanAddress) => (
                <li
                  key={loanAddress}
                  className="text-sm p-2 bg-muted rounded-md font-mono break-all flex items-center space-x-2"
                >
                  <span className="w-4" />
                  <a
                    href={`https://sepolia.basescan.org/address/${loanAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {loanAddress}
                  </a>
                </li>
              ))
            }
          </ul>
        )}
        <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-4">
          Refresh List
        </Button>
      </CardContent>
    </Card>
  );
}
