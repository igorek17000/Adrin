/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { PoolCreator } from "../PoolCreator";

export class PoolCreator__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<PoolCreator> {
    return super.deploy(overrides || {}) as Promise<PoolCreator>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): PoolCreator {
    return super.attach(address) as PoolCreator;
  }
  connect(signer: Signer): PoolCreator__factory {
    return super.connect(signer) as PoolCreator__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PoolCreator {
    return new Contract(address, _abi, signerOrProvider) as PoolCreator;
  }
}

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "PoolCreatorAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "PoolCreatorRemoved",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "addPoolCreator",
    outputs: [],
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
    name: "isPoolCreator",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renouncePoolCreator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061002161001c61003a565b61003e565b6100355761003561003061003a565b61005e565b6101c3565b3390565b60006100588260006100ad60201b6100ec1790919060201c565b92915050565b6100768160006100fe60201b6101341790919060201c565b6040516001600160a01b038216907fac89bb7b3d0c5a763a97f31bc75f8faee00426e7b235f02ca76897d55caf7b6190600090a250565b60006001600160a01b0382166100de5760405162461bcd60e51b81526004016100d590610181565b60405180910390fd5b506001600160a01b03166000908152602091909152604090205460ff1690565b61010882826100ad565b156101255760405162461bcd60e51b81526004016100d59061014a565b6001600160a01b0316600090815260209190915260409020805460ff19166001179055565b6020808252601f908201527f526f6c65733a206163636f756e7420616c72656164792068617320726f6c6500604082015260600190565b60208082526022908201527f526f6c65733a206163636f756e7420697320746865207a65726f206164647265604082015261737360f01b606082015260800190565b6103d6806101d26000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80638c2d741c146100465780639a94775d1461005b578063e281cc7e14610084575b600080fd5b610059610054366004610250565b61008c565b005b61006e610069366004610250565b6100c8565b60405161007b919061027e565b60405180910390f35b6100596100da565b610097610069610180565b6100bc5760405162461bcd60e51b81526004016100b3906102c0565b60405180910390fd5b6100c581610184565b50565b60006100d481836100ec565b92915050565b6100ea6100e5610180565b6101c6565b565b60006001600160a01b0382166101145760405162461bcd60e51b81526004016100b39061035e565b506001600160a01b03166000908152602091909152604090205460ff1690565b61013e82826100ec565b1561015b5760405162461bcd60e51b81526004016100b390610289565b6001600160a01b0316600090815260209190915260409020805460ff19166001179055565b3390565b61018f600082610134565b6040516001600160a01b038216907fac89bb7b3d0c5a763a97f31bc75f8faee00426e7b235f02ca76897d55caf7b6190600090a250565b6101d1600082610208565b6040516001600160a01b038216907f2bc71cc60b543df5fdd80ef5a45e1cdb344843769b649e9d901de3be24aeb24e90600090a250565b61021282826100ec565b61022e5760405162461bcd60e51b81526004016100b39061031d565b6001600160a01b0316600090815260209190915260409020805460ff19169055565b600060208284031215610261578081fd5b81356001600160a01b0381168114610277578182fd5b9392505050565b901515815260200190565b6020808252601f908201527f526f6c65733a206163636f756e7420616c72656164792068617320726f6c6500604082015260600190565b6020808252603a908201527f506f6f6c43726561746f72526f6c653a2063616c6c657220646f6573206e6f7460408201527f20686176652074686520506f6f6c43726561746f7220726f6c65000000000000606082015260800190565b60208082526021908201527f526f6c65733a206163636f756e7420646f6573206e6f74206861766520726f6c6040820152606560f81b606082015260800190565b60208082526022908201527f526f6c65733a206163636f756e7420697320746865207a65726f206164647265604082015261737360f01b60608201526080019056fea2646970667358221220a80845aa4714b38702360f2439fbdca4c790d36cfc7d9c79b74ec749f258bd6364736f6c63430008000033";
