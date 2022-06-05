import { expect, use } from "chai"
import { deployments, ethers } from "hardhat"
import { Signer, BigNumber, BigNumberish } from "ethers"
import { Address } from "hardhat-deploy/dist/types";
import { solidity, MockProvider } from "ethereum-waffle"
import { Agreement, ERC20Token, Factory, Governable } from "../src/types"
import config from 'config'
import getContractAddress from "@ethersproject/address"

use(solidity)

describe("workFlow", async () => {
    let factoryDeployer: Signer
    let agreementDeployer: Signer
    let signer1: Signer
    let signer2: Signer
    let signer3: Signer
    let voter1: Signer
    let voter2: Signer
    let voter3: Signer

    let factoryDeployerAddr: Address
    let agreementDeployerAddr: Address
    let signer1Addr: Address
    let signer2Addr: Address
    let signer3Addr: Address
    let voter1Addr: Address
    let voter2Addr: Address
    let voter3Addr: Address

    const oneUnit = BigNumber.from(10).pow(18);

    let factory: Factory
    let agreement: Agreement
    let stableCoin: ERC20Token
    let agreementToken: ERC20Token

    const tokenName: string = config.get("agreement_token_name")
    const tokenSymbol: string = config.get("agreement_token_symbol")
    const tokenTotalSupply: string = config.get("agreement_token_total_supply")
    const agreementQuorum: string = '2'
    let agreementVoters: string[] = []
    const agreementMaxDelay: number = config.get("agreement_max_delay")
    const agreementMinLockDuration: number = config.get("agreement_min_lock_duration")


    beforeEach(async () => {
        [factoryDeployer, agreementDeployer, signer1, signer2, signer3, voter1, voter2, voter3] = await ethers.getSigners()
        factoryDeployerAddr = await factoryDeployer.getAddress()
        agreementDeployerAddr = await agreementDeployer.getAddress()
        signer1Addr = await signer1.getAddress()
        signer2Addr = await signer2.getAddress()
        signer3Addr = await signer3.getAddress()
        voter1Addr = await voter1.getAddress()
        voter2Addr = await voter2.getAddress()
        voter3Addr = await voter3.getAddress()

        await deployments.fixture(["Factory"])
        factory = await ethers.getContract("Factory");
        stableCoin = await ethers.getContract("ERC20Token");

        await OwnerAddOperator(agreementDeployerAddr)
        let factoryS1 = factory.connect(agreementDeployer)
        let futureAddress;
        agreementVoters = [voter1Addr, voter2Addr, voter3Addr]
        
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
        agreement = await ethers.getContractAt("Agreement", futureAddress)
        agreementToken = await ethers.getContractAt("ERC20Token", await agreement.token())
    })

    it("initialize contract correctly", async () => {
        expect(await agreement.owner()).to.equal(agreementDeployerAddr);
    })

    const OwnerAddOperator = async (address: Address) => {
        await expect(
            factory.addOperator(
                address
            )
        ).to.emit(factory, "OperatorAdded")
    }
      
    const getCurrentTimestamp = async () => {
        let blockNum = await ethers.provider.getBlockNumber()
        return await (await ethers.provider.getBlock(blockNum)).timestamp
    }

    const unlockTokens = async () => {
        await moveTime(agreementMinLockDuration)
        let agreementV1 = agreement.connect(voter1)
        await expect(
            agreementV1.castVote()
        ).to.emit(agreement, "VoteCasted")
        let agreementV2 = agreement.connect(voter2)
        await expect(
            agreementV2.castVote()
        ).to.emit(agreement, "VoteCasted").to.emit(agreement, "Unlocked")
    }
    
    const moveTime = async (days: number) => {
        await ethers.provider.send("evm_increaseTime", [days * 24 * 60 * 60])
    }

    const chargeContract = async (value: number) => {
        let stableCoinD = stableCoin.connect(factoryDeployer)
        await stableCoinD.transfer(agreement.address, value)
    } 

    // vote and unlock tests
    it("non voter accounts and owner can't vote", async () => {
        let agreementS1 = agreement.connect(signer1)
        await expect(
            agreementS1.castVote()
        ).to.be.revertedWith("OperatorRole: caller does not have the Operator role")

        let agreementD1 = agreement.connect(factoryDeployer)
        await expect(
            agreementD1.castVote()
        ).to.be.revertedWith("OperatorRole: caller does not have the Operator role")

        let agreementD2 = agreement.connect(agreementDeployer)
        await expect(
            agreementD2.castVote()
        ).to.be.revertedWith("OperatorRole: caller does not have the Operator role")
    })
   
    it("voting process works ok and voters can't vote twice", async () => {
        await moveTime(agreementMinLockDuration)
        let agreementV1 = agreement.connect(voter1)
        expect(
            await agreementV1.hasVoted(voter1Addr)
        ).to.be.equal(false)
        expect(
            await agreementV1.votes()
        ).to.be.equal(0)

        await expect(
            agreementV1.castVote()
        ).to.emit(agreement, "VoteCasted")

        expect(
            await agreementV1.hasVoted(voter1Addr)
        ).to.be.equal(true)
        expect(
            await agreementV1.votes()
        ).to.be.equal(1)

        await expect(
            agreementV1.castVote()
        ).to.be.revertedWith("Agreement: already voted")

        expect(
            await agreementV1.hasVoted(voter1Addr)
        ).to.be.equal(true)
        expect(
            await agreementV1.votes()
        ).to.be.equal(1)
    })

    it("voters can't vote before voting start time", async () => {
        await moveTime(agreementMinLockDuration - 1)
        let agreementV1 = agreement.connect(voter1)
        await expect(
            agreementV1.castVote()
        ).to.be.revertedWith("Agreement: voting is not started yet")

        await moveTime(1)
        await agreementV1.castVote()
    })

    it("unlocking process works ok", async () => {
        await moveTime(agreementMinLockDuration)
        //cast one vote
        expect(
            await agreement.locked()
        ).to.be.equal(true)
        let agreementV1 = agreement.connect(voter1)
        await expect(
            agreementV1.castVote()
        ).to.emit(agreement, "VoteCasted")
        expect(
            await agreement.locked()
        ).to.be.equal(true)

        //check data before unlocking
        expect(
            await agreement.deadline()
        ).to.be.equal(0)

        // cast second vote and unlock
        let agreementV2 = agreement.connect(voter2)
        await expect(
            agreementV2.castVote()
        ).to.emit(agreement, "VoteCasted").to.emit(agreement, "Unlocked")
        
        
        let blockTime = await getCurrentTimestamp()
        
        expect(
            await agreement.deadline()
        ).to.be.equal(blockTime + (agreementMaxDelay * 86400))

        expect(
            await agreement.locked()
        ).to.be.equal(false)

        let agreementV3 = agreement.connect(voter3)

        // check voting after unlocking
        await expect(
            agreementV3.castVote()
        ).to.be.revertedWith("Agreement: tokens are already unlocked")
        expect(
            await agreement.locked()
        ).to.be.equal(false)

    })

    // set profit rate tests
    it("non owner accounts can't set profit rate", async () => {
        let agreementS1 = agreement.connect(signer1)
        await expect(
            agreementS1.setProfitRate(20)
        ).to.be.revertedWith("Ownable: caller is not the owner")
    })

    it("can't set profit rate less than 1000000", async () => {
        let agreementD = agreement.connect(agreementDeployer)
        await expect(
            agreementD.setProfitRate(999)
        ).to.be.revertedWith("Agreement: rate / 1000000 must be at least equal to one")
    })

    it("owner can change profit rate", async () => {
        let agreementD = agreement.connect(agreementDeployer)
        await expect(
            agreementD.setProfitRate(1000001)
        ).to.emit(agreement, "ProfitRateChanged").withArgs(1000001)
        
        expect(
            await agreement.profitRate()
        ).to.be.equal(1000001)
    })

    // increase deadline tests
    it("non owner accounts can't increase deadline", async () => {
        let agreementS1 = agreement.connect(signer1)
        await expect(
            agreementS1.increaseDeadline(20)
        ).to.be.revertedWith("Ownable: caller is not the owner")
    })

    it("can't change deadline before unlocking", async () => {
        let agreementD = agreement.connect(agreementDeployer)
        await expect(
            agreementD.increaseDeadline(10)
        ).to.be.revertedWith("Agreement: project is not finished yet")
    }) 

    it("owner can increase deadline", async () => {
        await unlockTokens()
        let agreementD = agreement.connect(agreementDeployer)
        let oldDeadline = await agreement.deadline()
        await expect(
            agreementD.increaseDeadline(10)
        ).to.emit(agreement, "DeadlineChanged")
        expect(
            await agreement.deadline()
        ).to.be.equal(oldDeadline.add(BigNumber.from(10).mul(86400)))
    })

    // discharge tests
    it("non owner accounts can't discharge", async () => {
        let agreementS1 = agreement.connect(signer1)
        await expect(
            agreementS1.discharge(voter3Addr)
        ).to.be.revertedWith("Ownable: caller is not the owner")
    })

    it("can't discharge before unlocking", async () => {
        let agreementD = agreement.connect(agreementDeployer)
        await expect(
            agreementD.discharge(voter3Addr)
        ).to.be.revertedWith("Agreement: project is not finished yet")
    })

    it("can't discharge before deadline pass", async () => {
        await unlockTokens()
        let agreementD = agreement.connect(agreementDeployer)
        await expect(
            agreementD.discharge(voter3Addr)
        ).to.be.revertedWith("Agreement: project deadline is not passed yet")
    })

    it("discharge works correctly", async () => {
        await unlockTokens()
        await chargeContract(20000)
        await moveTime(agreementMaxDelay)

        let agreementD = agreement.connect(agreementDeployer)
        await agreementD.discharge(signer3Addr)
        
        expect(
            await stableCoin.balanceOf(signer3Addr)
        ).to.be.equal(20000)
    })

    // receive profit tests
    it("can't receive profit before unlocking", async () => {
        let agreementS1 = agreement.connect(signer1)
        await expect(
            agreementS1.receiveProfit(voter3Addr)
        ).to.be.revertedWith("Agreement: project is not finished yet")
    })

    it("can't receive profit after deadline pass", async () => {
        await unlockTokens()
        await moveTime(agreementMaxDelay + 1)

        let agreementD = agreement.connect(agreementDeployer)
        await expect(
            agreementD.receiveProfit(voter3Addr)
        ).to.be.revertedWith("Agreement: project deadline is passed")
    })

    it("receive profit work correctly", async () => {
        let agreementTokenD = agreementToken.connect(agreementDeployer)
        await agreementTokenD.transfer(signer1Addr, 100)
        await agreementTokenD.transfer(signer2Addr, 200)
        let agreementTokenS2 = agreementToken.connect(signer2)
        await agreementTokenS2.transfer(signer1Addr, 20)

        await unlockTokens()
        await chargeContract(20000)

        let agreementS2 = agreement.connect(signer2)
        agreementTokenS2.approve(agreement.address, 180)
        await agreementS2.receiveProfit(signer2Addr)
        expect(await stableCoin.balanceOf(signer2Addr)).to.be.equal(180)

        // change profit rate
        let agreementD = agreement.connect(agreementDeployer)
        await expect(
            agreementD.setProfitRate(1200000)
        ).to.emit(agreement, "ProfitRateChanged")

        let agreementS1 = agreement.connect(signer1)
        let agreementTokenS1 = agreementToken.connect(signer1)
        agreementTokenS1.approve(agreement.address, 120)
        await agreementS1.receiveProfit(signer1Addr)
        expect(await stableCoin.balanceOf(signer1Addr)).to.be.equal(144)
    })

    it("can receive profit again if deadline increase", async () => {
        await unlockTokens()
        await moveTime(Number(agreementMaxDelay) + 1)

        let agreementS2 = agreement.connect(signer2)
        await expect(
            agreementS2.receiveProfit(voter3Addr)
        ).to.be.revertedWith("Agreement: project deadline is passed")
        
        let agreementD = agreement.connect(agreementDeployer)
        await expect(
            agreementD.increaseDeadline(2)
        ).to.emit(agreement, "DeadlineChanged")

        await  agreementS2.receiveProfit(voter3Addr)
    })
})

