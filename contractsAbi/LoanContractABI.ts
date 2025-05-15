export const myLoanContract = {
  loanFactoryAddress: "0xFD2CbCBCC2dC05E4FBd74fFdCe649a301918EEEC" as const,
  loanFactoryABI: [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_borrower",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_repaymentAmount",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "_admin",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "lender",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "time",
              "type": "uint256"
            }
          ],
          "name": "LoanFunded",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address[]",
              "name": "lender",
              "type": "address[]"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "time",
              "type": "uint256"
            }
          ],
          "name": "LoanRepaid",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "borrower",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "time",
              "type": "uint256"
            }
          ],
          "name": "LoanWithdrawn",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "admin",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "amountBorrowed",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "borrower",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getBalance",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getInvestors",
          "outputs": [
            {
              "internalType": "address[]",
              "name": "addresses",
              "type": "address[]"
            },
            {
              "internalType": "uint256[]",
              "name": "investedAmounts",
              "type": "uint256[]"
            },
            {
              "internalType": "uint256[]",
              "name": "repaidAmounts",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "investLoan",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "investors",
          "outputs": [
            {
              "internalType": "address payable",
              "name": "investorAddress",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amountInvested",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amountToBePaid",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "repayLoan",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "repaymentAmount",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "withdrawLoan",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ] as const
  };
  