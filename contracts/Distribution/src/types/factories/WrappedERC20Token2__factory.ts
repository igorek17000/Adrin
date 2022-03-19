/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { WrappedERC20Token2 } from "../WrappedERC20Token2";

export class WrappedERC20Token2__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    NAME: string,
    SYMBOL: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<WrappedERC20Token2> {
    return super.deploy(
      NAME,
      SYMBOL,
      overrides || {}
    ) as Promise<WrappedERC20Token2>;
  }
  getDeployTransaction(
    NAME: string,
    SYMBOL: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(NAME, SYMBOL, overrides || {});
  }
  attach(address: string): WrappedERC20Token2 {
    return super.attach(address) as WrappedERC20Token2;
  }
  connect(signer: Signer): WrappedERC20Token2__factory {
    return super.connect(signer) as WrappedERC20Token2__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): WrappedERC20Token2 {
    return new Contract(address, _abi, signerOrProvider) as WrappedERC20Token2;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "NAME",
        type: "string",
      },
      {
        internalType: "string",
        name: "SYMBOL",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162000ffa38038062000ffa833981016040819052620000349162000335565b8151829082906200004d906003906020850190620001e4565b50805162000063906004906020840190620001e4565b505050620000806200007a620000a760201b60201c565b620000ab565b6200009f6200008e620000a7565b69152d02c7e14af6800000620000fd565b505062000454565b3390565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6001600160a01b0382166200012f5760405162461bcd60e51b815260040162000126906200039c565b60405180910390fd5b6200013d60008383620001df565b8060026000828254620001519190620003dc565b90915550506001600160a01b0382166000908152602081905260408120805483929062000180908490620003dc565b90915550506040516001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90620001c5908590620003d3565b60405180910390a3620001db60008383620001df565b5050565b505050565b828054620001f29062000401565b90600052602060002090601f01602090048101928262000216576000855562000261565b82601f106200023157805160ff191683800117855562000261565b8280016001018555821562000261579182015b828111156200026157825182559160200191906001019062000244565b506200026f92915062000273565b5090565b5b808211156200026f576000815560010162000274565b600082601f8301126200029b578081fd5b81516001600160401b0380821115620002b857620002b86200043e565b6040516020601f8401601f1916820181018381118382101715620002e057620002e06200043e565b6040528382528584018101871015620002f7578485fd5b8492505b838310156200031a5785830181015182840182015291820191620002fb565b838311156200032b57848185840101525b5095945050505050565b6000806040838503121562000348578182fd5b82516001600160401b03808211156200035f578384fd5b6200036d868387016200028a565b9350602085015191508082111562000383578283fd5b5062000392858286016200028a565b9150509250929050565b6020808252601f908201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604082015260600190565b90815260200190565b60008219821115620003fc57634e487b7160e01b81526011600452602481fd5b500190565b6002810460018216806200041657607f821691505b602082108114156200043857634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b610b9680620004646000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c8063715018a61161008c578063a457c2d711610066578063a457c2d7146101b7578063a9059cbb146101ca578063dd62ed3e146101dd578063f2fde38b146101f0576100ea565b8063715018a6146101905780638da5cb5b1461019a57806395d89b41146101af576100ea565b806323b872dd116100c857806323b872dd14610142578063313ce56714610155578063395093511461016a57806370a082311461017d576100ea565b806306fdde03146100ef578063095ea7b31461010d57806318160ddd1461012d575b600080fd5b6100f7610203565b604051610104919061084c565b60405180910390f35b61012061011b366004610804565b610295565b6040516101049190610841565b6101356102b7565b6040516101049190610aea565b6101206101503660046107c9565b6102bd565b61015d6102eb565b6040516101049190610af3565b610120610178366004610804565b6102f0565b61013561018b366004610776565b61033c565b61019861035b565b005b6101a26103af565b604051610104919061082d565b6100f76103be565b6101206101c5366004610804565b6103cd565b6101206101d8366004610804565b61042e565b6101356101eb366004610797565b610446565b6101986101fe366004610776565b610471565b60606003805461021290610b25565b80601f016020809104026020016040519081016040528092919081815260200182805461023e90610b25565b801561028b5780601f106102605761010080835404028352916020019161028b565b820191906000526020600020905b81548152906001019060200180831161026e57829003601f168201915b5050505050905090565b6000806102a06104e2565b90506102ad8185856104e6565b5060019392505050565b60025490565b6000806102c86104e2565b90506102d585828561059a565b6102e08585856105e4565b506001949350505050565b601290565b6000806102fb6104e2565b6001600160a01b038082166000908152600160209081526040808320938916835292905220549091506102ad9082908690610337908790610b01565b6104e6565b6001600160a01b0381166000908152602081905260409020545b919050565b6103636104e2565b6001600160a01b03166103746103af565b6001600160a01b0316146103a35760405162461bcd60e51b815260040161039a906109e7565b60405180910390fd5b6103ad6000610708565b565b6005546001600160a01b031690565b60606004805461021290610b25565b6000806103d86104e2565b6001600160a01b03808216600090815260016020908152604080832093891683529290522054909150838110156104215760405162461bcd60e51b815260040161039a90610aa5565b6102e082868684036104e6565b6000806104396104e2565b90506102ad8185856105e4565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6104796104e2565b6001600160a01b031661048a6103af565b6001600160a01b0316146104b05760405162461bcd60e51b815260040161039a906109e7565b6001600160a01b0381166104d65760405162461bcd60e51b815260040161039a906108e2565b6104df81610708565b50565b3390565b6001600160a01b03831661050c5760405162461bcd60e51b815260040161039a90610a61565b6001600160a01b0382166105325760405162461bcd60e51b815260040161039a90610928565b6001600160a01b0380841660008181526001602090815260408083209487168084529490915290819020849055517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259061058d908590610aea565b60405180910390a3505050565b60006105a68484610446565b905060001981146105de57818110156105d15760405162461bcd60e51b815260040161039a9061096a565b6105de84848484036104e6565b50505050565b6001600160a01b03831661060a5760405162461bcd60e51b815260040161039a90610a1c565b6001600160a01b0382166106305760405162461bcd60e51b815260040161039a9061089f565b61063b83838361075a565b6001600160a01b038316600090815260208190526040902054818110156106745760405162461bcd60e51b815260040161039a906109a1565b6001600160a01b038085166000908152602081905260408082208585039055918516815290812080548492906106ab908490610b01565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516106f59190610aea565b60405180910390a36105de84848461075a565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b505050565b80356001600160a01b038116811461035657600080fd5b600060208284031215610787578081fd5b6107908261075f565b9392505050565b600080604083850312156107a9578081fd5b6107b28361075f565b91506107c06020840161075f565b90509250929050565b6000806000606084860312156107dd578081fd5b6107e68461075f565b92506107f46020850161075f565b9150604084013590509250925092565b60008060408385031215610816578182fd5b61081f8361075f565b946020939093013593505050565b6001600160a01b0391909116815260200190565b901515815260200190565b6000602080835283518082850152825b818110156108785785810183015185820160400152820161085c565b818111156108895783604083870101525b50601f01601f1916929092016040019392505050565b60208082526023908201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260408201526265737360e81b606082015260800190565b60208082526026908201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160408201526564647265737360d01b606082015260800190565b60208082526022908201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604082015261737360f01b606082015260800190565b6020808252601d908201527f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000604082015260600190565b60208082526026908201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604082015265616c616e636560d01b606082015260800190565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b60208082526025908201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604082015264647265737360d81b606082015260800190565b60208082526024908201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646040820152637265737360e01b606082015260800190565b60208082526025908201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604082015264207a65726f60d81b606082015260800190565b90815260200190565b60ff91909116815260200190565b60008219821115610b2057634e487b7160e01b81526011600452602481fd5b500190565b600281046001821680610b3957607f821691505b60208210811415610b5a57634e487b7160e01b600052602260045260246000fd5b5091905056fea26469706673582212202e55c462cb8e4287e0b331e5d587882b304c0c6bda10d435fc3ddf40089958d064736f6c63430008000033";
