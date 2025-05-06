import { useCallback, useEffect, useState } from "react";
import type { Hex } from "viem";
import { useAccount, useConnect, usePublicClient, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { cbWalletConnector } from "./wagmi";

export function ConnectAndSIWE() {
  const { connect } = useConnect({
    mutation: {
      onSuccess: (data) => {
        const address = data.accounts[0];
        const chainId = data.chainId;
        const m = new SiweMessage({
          domain: document.location.host,
          address,
          chainId,
          uri: document.location.origin,
          version: "1",
          statement: "Smart Wallet SIWE Example",
          nonce: "12345678",
        });
        setMessage(m);
        signMessage({ message: m.prepareMessage() });
      },
    },
  });
  const account = useAccount();
  const client = usePublicClient();
  const [signature, setSignature] = useState<Hex | undefined>(undefined);
  const { signMessage } = useSignMessage({
    mutation: { onSuccess: (sig) => setSignature(sig) },
  });
  const [message, setMessage] = useState<SiweMessage | undefined>(undefined);

  const [valid, setValid] = useState<boolean | undefined>(undefined);

  const checkValid = useCallback(async () => {
    if (!signature || !account.address || !client || !message) return;

    client
      .verifyMessage({
        address: account.address,
        message: message.prepareMessage(),
        signature,
      })
      .then((v) => setValid(v));
  }, [signature, account]);

  useEffect(() => {
    checkValid();
  }, [signature, account]);

  useEffect(() => { });

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white shadow-md rounded-2xl max-w-sm mx-auto">
      <button
        onClick={() => connect({ connector: cbWalletConnector })}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200"
      >
        Connect Wallet 
      </button>
      <p className="text-gray-600 text-sm">{/* Add a message here if needed */}</p>
      {valid !== undefined && (
        <p className={`text-sm font-medium ${valid ? 'text-green-600' : 'text-red-600'}`}>
          Is valid: {valid.toString()}
        </p>
      )}
    </div>

  );
}