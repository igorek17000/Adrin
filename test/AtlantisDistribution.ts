import { expect, use } from "chai"
import { ethers } from "hardhat"
import { Signer, BigNumber, BigNumberish } from "ethers"
import { Address } from "hardhat-deploy/dist/types";
import { solidity, MockProvider } from "ethereum-waffle"

import { AtlantisDistribution } from "../src/types/AtlantisDistribution"
import { AtlantisDistribution__factory } from "../src/types/factories/AtlantisDistribution__factory"

use(solidity)

describe("AtlantisDistribution", async () => {
    let tokenName = "AtlantisDistribution"
    let tokenSymbol = "ADT"
    // let tokenCurrency = "NullCurrency"

    let foundWallet: Signer
    let signer1: Signer
    let signer2: Signer
    let signer3: Signer
    let signer4: Signer
    let founderSigner: Signer
    

    let foundWalletAddr: Address
    let signer1Addr: Address
    let signer2Addr: Address
    let signer3Addr: Address
    let signer4Addr: Address
    let founderAddr: Address

    const oneHundred = BigNumber.from(10).pow(18).mul(100);
    const oneUnit = BigNumber.from(10).pow(18);
    const founder = 2;
    const core = 1;
    const user = 0;

    let AtlantisDistribution: AtlantisDistribution

    beforeEach(async () => {
        [foundWallet, signer1, signer2, signer3, signer4, founderSigner] = await ethers.getSigners()
        foundWalletAddr = await foundWallet.getAddress()
        signer1Addr = await signer1.getAddress()
        signer2Addr = await signer2.getAddress()
        signer3Addr = await signer3.getAddress()
        signer4Addr = await signer4.getAddress()
        founderAddr = await founderSigner.getAddress()
        AtlantisDistribution = await deployAtlantisDistribution()
        await initializeLevels();
		await initializeBalances();
    })

    const initializeLevels = async () => {
        await AtlantisDistribution.changeLvl(
          founderAddr,
          founder
        )
        
        AtlantisDistribution.connect(signer1)
        await AtlantisDistribution.changeLvl(
          signer4Addr,
          core
        )
    }

	const initializeBalances = async () => {
        await AtlantisDistribution.transfer(
			signer2Addr,
			oneUnit.mul(100)
		  )
  
		  await AtlantisDistribution.transfer(
			signer3Addr,
			oneUnit.mul(200)
		  )
  
		  await AtlantisDistribution.transfer(
			signer4Addr,
			oneUnit.mul(250)
		  )
  
		  await AtlantisDistribution.transfer(
			founderAddr,
			oneUnit.mul(400)
		  )
    }

    const deployAtlantisDistribution = async (_signer?: Signer): Promise<AtlantisDistribution> => {
        const AtlantisDistributionFactory = new AtlantisDistribution__factory(_signer || signer1)
        const AtlantisDistribution = await AtlantisDistributionFactory.deploy(
            tokenName,
            tokenSymbol,
            foundWalletAddr
        )
        return AtlantisDistribution
    }

    it("initialize contract correctly", async () => {
        expect(await AtlantisDistribution.name()).to.equal("AtlantisDistribution")
        expect(await AtlantisDistribution.symbol()).to.equal("ADT")
        expect(await AtlantisDistribution.decimals()).to.equal(18)

        expect(await AtlantisDistribution.balanceOf(AtlantisDistribution.address)).to.equal(
          0
        )
        expect(await AtlantisDistribution.fund_wallet()).to.equal(await foundWallet.getAddress());
    })

    it("initialize levels correctly", async () => {
        expect(
          await AtlantisDistribution.level(signer4Addr)
        ).to.equal(core)
        expect(
          await AtlantisDistribution.level(founderAddr)
        ).to.equal(founder)
    })

    it("initialize balances correctly", async () => {
        expect(
            await AtlantisDistribution.balanceOf(signer2Addr)
        ).to.equal(oneUnit.mul(100))
        expect(
            await AtlantisDistribution.balanceOf(signer3Addr)
        ).to.equal(oneUnit.mul(200))
        expect(
            await AtlantisDistribution.balanceOf(signer4Addr)
        ).to.equal(oneUnit.mul(250))
        expect(
            await AtlantisDistribution.balanceOf(founderAddr)
        ).to.equal(oneUnit.mul(400))
    })

    it("non owner accounts can't mint new tokens", async () => {
        let AtlantisDistributionS2 = AtlantisDistribution.connect(signer2)

        await expect(
            AtlantisDistributionS2.mint(
                oneHundred
            )
        ).to.be.revertedWith("Ownable: caller is not the owner")
    })

	const epsilon = BigNumber.from(10).pow(2).mul(1);

    it("owner can mint new tokens and new tokens distribution is corrects", async () => {
        await AtlantisDistribution.mint(
            oneUnit.mul(1000)
        )

        expect(
            await AtlantisDistribution.balanceOf(founderAddr)
        ).to.equal(oneUnit.mul(650))

        expect(
            await AtlantisDistribution.balanceOf(signer4Addr)
        ).to.equal(oneUnit.mul(500))

        expect(
            await AtlantisDistribution.balanceOf(foundWalletAddr)
        ).to.equal(oneUnit.mul(500))
    })

	it("mint, changing level from 0 to level 1, mint again works correctly", async () => {
        await AtlantisDistribution.mint(
            oneUnit.mul(1000)
        )

        await AtlantisDistribution.changeLvl(
          signer3Addr,
          core
        )
		expect(
			await AtlantisDistribution.level(signer3Addr)
		).to.equal(core)

		await AtlantisDistribution.mint(
            oneUnit.mul(1000)
        )

		expect(
            await AtlantisDistribution.balanceOf(founderAddr)
        ).to.equal(oneUnit.mul(900))

        expect(
            await AtlantisDistribution.balanceOf(signer4Addr)
        ).to.equal(oneUnit.mul(500).add(oneUnit.mul(250 * 500).div(700)))

		expect(
            await AtlantisDistribution.balanceOf(signer3Addr)
        ).to.equal(oneUnit.mul(200).add(oneUnit.mul(250 * 200).div(700)))

        expect(
            await AtlantisDistribution.balanceOf(foundWalletAddr)
        ).to.equal(oneUnit.mul(1000))

    })

    // it("non master minter can not remove a minter", async () => {
    //     let AtlantisDistributionMM = AtlantisDistribution.connect(masterMinter)

    //     await AtlantisDistributionMM.configureMinter(
    //         signer3Addr,
    //         oneHundred
    //     )

    //     expect(
    //         await AtlantisDistribution.isMinter(signer3Addr)
    //     ).to.equal(true)

    //     let AtlantisDistributionS2 = AtlantisDistribution.connect(signer2)

    //     await expect(
    //         AtlantisDistributionS2.removeMinter(signer3Addr)
    //     ).to.be.revertedWith("TokenToken: caller is not the masterMinter")
    // })

    // it("master minter can remove a minter", async () => {
    //     let AtlantisDistributionMM = AtlantisDistribution.connect(masterMinter)

    //     await AtlantisDistributionMM.configureMinter(
    //         signer3Addr,
    //         oneHundred
    //     )

    //     expect(
    //         await AtlantisDistribution.isMinter(signer3Addr)
    //     ).to.equal(true)

    //     await AtlantisDistributionMM.removeMinter(signer3Addr)

    //     expect(
    //         await AtlantisDistribution.isMinter(signer3Addr)
    //     ).to.equal(false)
    // })

    // it("only owner can update master minter", async () => {
    //     let AtlantisDistributionS2 = AtlantisDistribution.connect(signer2)

    //     await expect(
    //         AtlantisDistributionS2.updateMasterMinter(
    //             signer3Addr
    //         )
    //     ).to.be.revertedWith("Ownable: caller is not the owner")


    //     let AtlantisDistributionS1 = AtlantisDistribution.connect(signer1)

    //     await AtlantisDistributionS1.updateMasterMinter(signer3Addr)

    //     expect(
    //         await AtlantisDistribution.theMasterMinter()
    //     ).to.equal(signer3Addr)
    // })

    // it("non minters can not mint new tokens", async () => {
    //     let AtlantisDistributionMM = AtlantisDistribution.connect(masterMinter)

    //     await AtlantisDistributionMM.configureMinter(
    //         signer3Addr,
    //         oneHundred
    //     )

    //     let AtlantisDistributionS4 = AtlantisDistribution.connect(signer4)

    //     await expect(
    //         AtlantisDistributionS4.mint(
    //             signer4Addr, 
    //             oneHundred
    //         )
    //     ).to.be.revertedWith("PayToken: caller is not a minter")

    // })

    

    // it("non minters can not burn tokens", async () => {
    //     let AtlantisDistributionMM = AtlantisDistribution.connect(masterMinter)

    //     await AtlantisDistributionMM.configureMinter(
    //         signer3Addr,
    //         oneHundred
    //     )

    //     let AtlantisDistributionS4 = AtlantisDistribution.connect(signer4)

    //     await expect(
    //         AtlantisDistributionS4.burn(
    //             oneHundred
    //         )
    //     ).to.be.revertedWith("PayToken: caller is not a minter")

    // })

    // it("minters can burn tokens", async () => {
    //     let AtlantisDistributionMM = AtlantisDistribution.connect(masterMinter)

    //     await AtlantisDistributionMM.configureMinter(
    //         signer3Addr,
    //         oneHundred
    //     )

    //     let AtlantisDistributionS3 = AtlantisDistribution.connect(signer3)

    //     await AtlantisDistributionS3.mint(
    //         signer3Addr, 
    //         oneHundred
    //     )

    //     expect(
    //         await AtlantisDistribution.balanceOf(signer3Addr)
    //     ).to.equal(oneHundred)

    //     expect(
    //         await AtlantisDistributionS3.burn(oneHundred)
    //     ).to.emit(AtlantisDistribution, "Burn")

    // })

    // it("transferWithReferralCode", async () => {
    //     let AtlantisDistributionMM = AtlantisDistribution.connect(masterMinter)

    //     await AtlantisDistributionMM.configureMinter(
    //         signer3Addr,
    //         oneHundred
    //     )

    //     let AtlantisDistributionS3 = AtlantisDistribution.connect(signer3)

    //     await AtlantisDistributionS3.mint(
    //         signer4Addr, 
    //         oneHundred
    //     )

    //     let AtlantisDistributionS4 = AtlantisDistribution.connect(signer4)

    //     expect(
    //         await AtlantisDistributionS4.transferWithReferralCode(
    //             signer1Addr,
    //             oneHundred,
    //             theReferralCode
    //         )
    //     ).to.emit(AtlantisDistribution, "TransferWithReferralCode")

    // })

    // it("transferFromWithReferralCode", async () => {
    //     let AtlantisDistributionMM = AtlantisDistribution.connect(masterMinter)

    //     await AtlantisDistributionMM.configureMinter(
    //         signer3Addr,
    //         oneHundred
    //     )

    //     let AtlantisDistributionS3 = AtlantisDistribution.connect(signer3)

    //     await AtlantisDistributionS3.mint(
    //         signer4Addr, 
    //         oneHundred
    //     )

    //     let AtlantisDistributionS4 = AtlantisDistribution.connect(signer4)

    //     await AtlantisDistributionS4.approve(signer2Addr, oneHundred)

    //     let AtlantisDistributionS2 = AtlantisDistribution.connect(signer2)

    //     expect(
    //         await AtlantisDistributionS2.transferFromWithReferralCode(
    //             signer4Addr,
    //             signer1Addr,
    //             oneHundred,
    //             theReferralCode
    //         )
    //     ).to.emit(AtlantisDistribution, "TransferWithReferralCode")

    // })
})

