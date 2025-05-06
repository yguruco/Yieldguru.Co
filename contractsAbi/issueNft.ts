export const myNftContract = {
    address: "0x1636E0d12FCe29eB724Dc53c683D62b1eC88f5F2" as const,
    abi: [
      {
        inputs: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "string", name: "uri", type: "string" }
        ],
        name: "safeMint",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function"
      }
    ] as const
  };
  