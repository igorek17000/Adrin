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
    let coreSigner1: Signer
	let coreSigner2: Signer
    let founderSigner1: Signer
	let founderSigner2: Signer
    

    let foundWalletAddr: Address
    let signer1Addr: Address
    let signer2Addr: Address
    let signer3Addr: Address
    let coreSigner1Addr: Address
	let coreSigner2Addr: Address
    let founder1Addr: Address
	let founder2Addr: Address

    const oneHundred = BigNumber.from(10).pow(18).mul(100);
    const oneUnit = BigNumber.from(10).pow(18);
	const _totalSupply =  oneUnit.mul(300).mul(1000000);
    const founder = 2;
    const core = 1;
    const user = 0;

    let AtlantisDistribution: AtlantisDistribution

    beforeEach(async () => {
        [foundWallet, signer1, signer2, signer3, coreSigner1, coreSigner2, founderSigner1, founderSigner2] = await ethers.getSigners()
        foundWalletAddr = await foundWallet.getAddress()
        signer1Addr = await signer1.getAddress()
        signer2Addr = await signer2.getAddress()
        signer3Addr = await signer3.getAddress()
        coreSigner1Addr = await coreSigner1.getAddress()
		coreSigner2Addr = await coreSigner2.getAddress()
        founder1Addr = await founderSigner1.getAddress()
		founder2Addr = await founderSigner2.getAddress()
        AtlantisDistribution = await deployAtlantisDistribution()
        await initializeLevels();
		await initializeBalances();
    })

    const initializeLevels = async () => {
        await AtlantisDistribution.changeLvl(
          founder1Addr,
          founder
        )

		await AtlantisDistribution.changeLvl(
			founder2Addr,
			founder
		  )
        
        await AtlantisDistribution.changeLvl(
          coreSigner1Addr,
          core
        )

		await AtlantisDistribution.changeLvl(
			coreSigner2Addr,
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
			coreSigner1Addr,
			oneUnit.mul(250)
		  )

		  await AtlantisDistribution.transfer(
			coreSigner2Addr,
			oneUnit.mul(200)
		  )
  
		  await AtlantisDistribution.transfer(
			founder1Addr,
			oneUnit.mul(400)
		  )

		  await AtlantisDistribution.transfer(
			founder2Addr,
			oneUnit.mul(500)
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
		expect(await AtlantisDistribution.totalSupply()).to.equal(_totalSupply);
        expect(await AtlantisDistribution.fund_wallet()).to.equal(await foundWallet.getAddress());
    })

    it("initialize levels correctly", async () => {
        expect(
          await AtlantisDistribution.levelOf(coreSigner1Addr)
        ).to.equal(core)
        expect(
          await AtlantisDistribution.levelOf(founder1Addr)
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
            await AtlantisDistribution.balanceOf(coreSigner1Addr)
        ).to.equal(oneUnit.mul(250))
		expect(
            await AtlantisDistribution.balanceOf(coreSigner2Addr)
        ).to.equal(oneUnit.mul(200))
        expect(
            await AtlantisDistribution.balanceOf(founder1Addr)
        ).to.equal(oneUnit.mul(400))
		expect(
            await AtlantisDistribution.balanceOf(founder2Addr)
        ).to.equal(oneUnit.mul(500))
		expect(await AtlantisDistribution.totalSupply()).to.equal(_totalSupply);
    })

    it("non owner accounts can't mint new tokens", async () => {
        let AtlantisDistributionS2 = AtlantisDistribution.connect(signer2)

        await expect(
            AtlantisDistributionS2.mint(
                oneHundred
            )
        ).to.be.revertedWith("Ownable: caller is not the owner")
    })

	it("non owner accounts can't change other account's level", async () => {
        let AtlantisDistributionS2 = AtlantisDistribution.connect(signer2)

        await expect(
            AtlantisDistributionS2.changeLvl(
				signer3Addr,
                founder
            )
        ).to.be.revertedWith("Ownable: caller is not the owner")
    })

	const epsilon = BigNumber.from(10);

    it("owner can mint new tokens and new tokens distribution is correct", async () => {
        await AtlantisDistribution.mint(
            oneUnit.mul(1000)
        )

        expect(
            await AtlantisDistribution.balanceOf(founder1Addr)
        ).to.equal(oneUnit.mul(400).add(oneUnit.mul(250 * 4).div(9)))

		expect(
            await AtlantisDistribution.balanceOf(founder2Addr)
        ).to.equal(oneUnit.mul(500).add(oneUnit.mul(250 * 5).div(9)))

        expect(
            await AtlantisDistribution.balanceOf(coreSigner1Addr)
        ).to.equal(oneUnit.mul(250).add(oneUnit.mul(250 * 25).div(45)))

		expect(
            await AtlantisDistribution.balanceOf(coreSigner2Addr)
        ).to.equal(oneUnit.mul(200).add(oneUnit.mul(250 * 20).div(45)))

        expect(
            await AtlantisDistribution.balanceOf(foundWalletAddr)
        ).to.equal(oneUnit.mul(500))

		expect(await AtlantisDistribution.totalSupply()).to.equal(_totalSupply.add(oneUnit.mul(1000)));
    })

	it("mint, changing level from 0 to level 1, mint again works correctly", async () => {
        await AtlantisDistribution.mint(
            oneUnit.mul(1000)
        )

		let oldBalanceCore1 =  await AtlantisDistribution.balanceOf(coreSigner1Addr);
		let oldBalanceCore2 = await AtlantisDistribution.balanceOf(coreSigner2Addr);
		let oldBalanceCore3 = await AtlantisDistribution.balanceOf(signer3Addr);
		let sumOldBalances = oldBalanceCore1.add(oldBalanceCore2).add(oldBalanceCore3);
        await AtlantisDistribution.changeLvl(
          signer3Addr,
          core
        )
		expect(
			await AtlantisDistribution.levelOf(signer3Addr)
		).to.equal(core)

		await AtlantisDistribution.mint(
            oneUnit.mul(2000)
        )
        
        expect(
            await AtlantisDistribution.balanceOf(foundWalletAddr)
        ).to.equal(oneUnit.mul(1500))

        expect(
            await AtlantisDistribution.balanceOf(coreSigner1Addr)
        ).to.be.closeTo(oldBalanceCore1.add(oneUnit.mul(500).mul(oldBalanceCore1).div(sumOldBalances)), epsilon)

		expect(
            await AtlantisDistribution.balanceOf(coreSigner2Addr)
        ).to.be.closeTo(oldBalanceCore2.add(oneUnit.mul(500).mul(oldBalanceCore2).div(sumOldBalances)), epsilon)

		expect(
            await AtlantisDistribution.balanceOf(signer3Addr)
        ).to.be.closeTo(oldBalanceCore3.add(oneUnit.mul(500).mul(oldBalanceCore3).div(sumOldBalances)), epsilon)


		expect(await AtlantisDistribution.totalSupply()).to.equal(_totalSupply.add(oneUnit.mul(3000)));

    })

	it("transfer between account and then mint works correctly", async () => {
		let AtlantisDistributionS2 = AtlantisDistribution.connect(signer2)
        await AtlantisDistributionS2.transfer(
			founder1Addr,
            oneUnit.mul(20)
        )

		let AtlantisDistributionF2 = AtlantisDistribution.connect(founderSigner2)
		await AtlantisDistributionF2.transfer(
			coreSigner1Addr,
            oneUnit.mul(50)
        )

		let AtlantisDistributionC2 = AtlantisDistribution.connect(coreSigner2)
		await AtlantisDistributionC2.transfer(
			coreSigner1Addr,
            oneUnit.mul(30)
        )

		expect(
            await AtlantisDistribution.balanceOf(signer2Addr)
        ).to.be.closeTo(oneUnit.mul(80), epsilon)

		expect(
            await AtlantisDistribution.balanceOf(founder1Addr)
        ).to.be.closeTo(oneUnit.mul(420), epsilon)

		expect(
            await AtlantisDistribution.balanceOf(founder2Addr)
        ).to.be.closeTo(oneUnit.mul(450), epsilon)

		expect(
            await AtlantisDistribution.balanceOf(coreSigner2Addr)
        ).to.be.closeTo(oneUnit.mul(170), epsilon)

		expect(
            await AtlantisDistribution.balanceOf(coreSigner1Addr)
        ).to.be.closeTo(oneUnit.mul(330), epsilon)

		await AtlantisDistribution.mint(
            oneUnit.mul(300)
        )
		
		expect(
            await AtlantisDistribution.balanceOf(founder1Addr)
        ).to.be.closeTo(oneUnit.mul(420).add(oneUnit.mul(420 * 75).div(870)), epsilon)

		expect(
            await AtlantisDistribution.balanceOf(founder2Addr)
        ).to.be.closeTo(oneUnit.mul(450).add(oneUnit.mul(450 * 75).div(870)), epsilon)

		expect(
            await AtlantisDistribution.balanceOf(coreSigner1Addr)
        ).to.be.closeTo(oneUnit.mul(330).add(oneUnit.mul(330 * 75).div(500)), epsilon)

		expect(
            await AtlantisDistribution.balanceOf(coreSigner2Addr)
        ).to.be.closeTo(oneUnit.mul(170).add(oneUnit.mul(170 * 75).div(500)), epsilon)

		expect(await AtlantisDistribution.totalSupply()).to.equal(_totalSupply.add(oneUnit.mul(300)));
    })

	it("mint to non regular shareholder works correctly", async () => {
		await AtlantisDistribution.mintToNRS(
			coreSigner2Addr,
            oneUnit.mul(30)
        );
        expect(
            await AtlantisDistribution.balanceOf(foundWalletAddr)
        ).to.equal(oneUnit.mul(60))

		expect(
            await AtlantisDistribution.balanceOf(founder1Addr)
        ).to.be.closeTo(oneUnit.mul(400).add(oneUnit.mul(30 * 4).div(9)), epsilon)

		expect(
            await AtlantisDistribution.balanceOf(founder2Addr)
        ).to.be.closeTo(oneUnit.mul(500).add(oneUnit.mul(30 * 5).div(9)), epsilon)

		expect(
            await AtlantisDistribution.balanceOf(coreSigner2Addr)
        ).to.be.closeTo(oneUnit.mul(230), epsilon)
		
		expect(await AtlantisDistribution.totalSupply()).to.equal(_totalSupply.add(oneUnit.mul(120)));
	})

	it("mint to regular shareholder works correctly", async () => {
		await AtlantisDistribution.mintToRS(
			signer2Addr,
            oneUnit.mul(30)
        );
		    
		expect(
            await AtlantisDistribution.balanceOf(signer2Addr)
        ).to.be.closeTo(oneUnit.mul(130), epsilon)

		expect(
            await AtlantisDistribution.balanceOf(founder1Addr)
        ).to.be.closeTo(oneUnit.mul(400).add(oneUnit.mul(15 * 4).div(9)), epsilon)

		expect(
            await AtlantisDistribution.balanceOf(founder2Addr)
        ).to.be.closeTo(oneUnit.mul(500).add(oneUnit.mul(15 * 5).div(9)), epsilon)

		expect(
            await AtlantisDistribution.balanceOf(coreSigner1Addr)
        ).to.be.closeTo(oneUnit.mul(250).add(oneUnit.mul(15 * 25).div(45)), epsilon)

		expect(
            await AtlantisDistribution.balanceOf(coreSigner2Addr)
        ).to.be.closeTo(oneUnit.mul(200).add(oneUnit.mul(15 * 20).div(45)), epsilon)

		expect(await AtlantisDistribution.totalSupply()).to.equal(_totalSupply.add(oneUnit.mul(60)));

	})

	it("mint to regular shareholder doesn't work for non regular shareholders", async () => {
		await expect ( AtlantisDistribution.mintToRS(
			founder1Addr,
            oneUnit.mul(2000)
        )).to.be.revertedWith("account is not a regular shareholder");

		await expect ( AtlantisDistribution.mintToRS(
			coreSigner1Addr,
            oneUnit.mul(2000)
        )).to.be.revertedWith("account is not a regular shareholder");

		await AtlantisDistribution.changeLvl(
			signer3Addr,
			core
		)

		await expect ( AtlantisDistribution.mintToRS(
			signer3Addr,
            oneUnit.mul(2000)
        )).to.be.revertedWith("account is not a regular shareholder");

	})

	it("mint to non regular shareholder doesn't work for regular shareholders", async () => {
		await expect ( AtlantisDistribution.mintToNRS(
			signer2Addr,
            oneUnit.mul(2000)
        )).to.be.revertedWith("account is a regular shareholder");

		await AtlantisDistribution.changeLvl(
			founder1Addr,
			user
		)

		await expect ( AtlantisDistribution.mintToNRS(
			founder1Addr,
            oneUnit.mul(2000)
        )).to.be.revertedWith("account is a regular shareholder");

	})

	it("burn and mint again works correctly", async () => {
		let AtlantisDistributionF1 = AtlantisDistribution.connect(founderSigner1)
		await AtlantisDistributionF1.burn(
            oneUnit.mul(100)
        )


		expect(
            await AtlantisDistribution.balanceOf(founder1Addr)
        ).to.be.closeTo(oneUnit.mul(300), epsilon)

		await AtlantisDistribution.mint(
            oneUnit.mul(300)
        )

		expect(
            await AtlantisDistribution.balanceOf(founder1Addr)
        ).to.be.closeTo(oneUnit.mul(300).add(oneUnit.mul(75 * 3).div(8)), epsilon)

		expect(
            await AtlantisDistribution.balanceOf(founder2Addr)
        ).to.be.closeTo(oneUnit.mul(500).add(oneUnit.mul(75 * 5).div(8)), epsilon)

		expect(await AtlantisDistribution.totalSupply()).to.equal(_totalSupply.add(oneUnit.mul(200)));
	})
	
})

