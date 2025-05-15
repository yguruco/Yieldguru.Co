export const loanFactoryABI =  [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "loanAddress",
                    "type": "address"
                },
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
            "name": "LoanCreated",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "allLoans",
            "outputs": [
                {
                    "internalType": "contract Loan",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                },
                {
                    "internalType": "address payable",
                    "name": "_borrower",
                    "type": "address"
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
            "name": "createLoan",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "loanAddress",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getAllLoans",
            "outputs": [
                {
                    "internalType": "contract Loan[]",
                    "name": "",
                    "type": "address[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ] as const ;
  
    export const loanFactoryAddress = "0x74845b53f1807F6547aEB4c85daE2516cbBcF80b" ;
  