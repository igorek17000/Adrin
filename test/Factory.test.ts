import { expect, use } from "chai"
import { deployments, ethers } from "hardhat"
import { Signer, BigNumber, BigNumberish } from "ethers"
import { Address } from "hardhat-deploy/dist/types";
import { solidity, MockProvider } from "ethereum-waffle"
import { ERC20Token, Factory, Governable } from "../src/types"
import config from 'config'

use(solidity)

describe("factory", async () => {
    let deployer: Signer
    let signer1: Signer
    let signer2: Signer
    let signer3: Signer

    let deployerAddr: Address
    let signer1Addr: Address
    let signer2Addr: Address
    let signer3Addr: Address

    const oneUnit = BigNumber.from(10).pow(18);

    let factory: Factory
    let stableCoin: ERC20Token

    const tokenName: string = config.get("agreement_token_name")
    const tokenSymbol: string = config.get("agreement_token_symbol")
    const tokenTotalSupply: string = config.get("agreement_token_total_supply")
    const agreementQuorum: string = config.get("agreement_quorum")
    const agreementVoters: string[] = config.get("agreement_voters")
    const agreementMaxDelay: string = config.get("agreement_max_delay")
    const agreementMinLockDuration: string = config.get("agreement_min_lock_duration")

    beforeEach(async () => {
        [deployer, signer1, signer2, signer3] = await ethers.getSigners()
        deployerAddr = await deployer.getAddress()
        signer1Addr = await signer1.getAddress()
        signer2Addr = await signer2.getAddress()
        signer3Addr = await signer3.getAddress()

        await deployments.fixture(["Factory"])
        factory = await ethers.getContract("Factory");
        stableCoin = await ethers.getContract("ERC20Token");
    })
    
    it("initialize contract correctly", async () => {
        expect(await factory.owner()).to.equal(deployerAddr);
    })

    it("non owner accounts can't add new operator", async () => {
        let factoryS1 = factory.connect(signer1)

        await expect(
             factoryS1.addOperator(
                signer2Addr
            )
        ).to.be.revertedWith("Ownable: caller is not the owner")
    })

    it("non owner accounts can't remove an operator", async () => {
        let factoryS1 = factory.connect(signer1)

        await expect(
             factoryS1.addOperator(
                deployerAddr
            )
        ).to.be.revertedWith("Ownable: caller is not the owner")
    })

    const OwnerAddOperator = async (address: Address) => {
        await expect(
            factory.addOperator(
                address
            )
        ).to.emit(factory, "OperatorAdded")
    }

    const OwnerRemoveOperator = async (address: Address) => {
        await expect(
            factory.removeOperator(
                address
            )
        ).to.emit(factory, "OperatorRemoved")
    }

    const CheckIsOperator = async (address: Address, status: Boolean) => {
        expect(
            await factory.isOperator(
                address
            )
        ).to.equal(status)
    }

    it("owner can add a new operator and can remove it (event check) ", async () => {
        await CheckIsOperator(signer2Addr, false)
        await OwnerAddOperator(signer2Addr)
        await CheckIsOperator(signer2Addr, true)
        await OwnerRemoveOperator(signer2Addr);
        await CheckIsOperator(signer2Addr, false);
    })

    it("non operator accounts can't deploy new agreement", async () => {
        let factoryS1 = factory.connect(signer1)

        await expect(
            factoryS1.deployNewAgreement(
                tokenName,
                tokenSymbol,
                tokenTotalSupply,
                agreementQuorum,
                agreementVoters,
                agreementMaxDelay,
                agreementMinLockDuration,
                stableCoin.address
            )
        ).to.be.revertedWith("OperatorRole: caller does not have the Operator role")
    })

    it("owner has operator access", async () => {
        let factoryD = factory.connect(deployer)
        let futureAddress;
        futureAddress = ethers.utils.getContractAddress({
            from: factory.address,
            nonce: 1
        })
        await expect(
            factoryD.deployNewAgreement(
                tokenName,
                tokenSymbol,
                tokenTotalSupply,
                agreementQuorum,
                agreementVoters,
                agreementMaxDelay,
                agreementMinLockDuration,
                stableCoin.address
            )
        ).to.emit(factory, "AgreementCreated").withArgs(futureAddress)
    })
    
    it("operator accounts can deploy new agreement", async () => {
        await OwnerAddOperator(signer1Addr)
        let factoryS1 = factory.connect(signer1)
        let futureAddress;
        
        futureAddress = ethers.utils.getContractAddress({
            from: factory.address,
            nonce: 1
        })

        await expect(
            factoryS1.deployNewAgreement(
                tokenName,
                tokenSymbol,
                tokenTotalSupply,
                agreementQuorum,
                agreementVoters,
                agreementMaxDelay,
                agreementMinLockDuration,
                stableCoin.address
            )
        ).to.emit(factory, "AgreementCreated").withArgs(futureAddress)
    })
})

