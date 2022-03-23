import { expect, use } from "chai"
import { ethers } from "hardhat"
import { Signer, BigNumber, BigNumberish } from "ethers"
import { Address } from "hardhat-deploy/dist/types";
import { solidity, MockProvider } from "ethereum-waffle"
import { AtlantisPayToken } from "../src/types/AtlantisPayToken"
import { AtlantisPayToken__factory } from "../src/types/factories/AtlantisPayToken__factory"

use(solidity)

describe("atlantisPaytoken", async () => {
    let tokenName = "atlantisPaytoken"
    let tokenSymbol = "ADT"
    // let tokenCurrency = "NullCurrency"

    let masterMinter: Signer
    let fundWallet: Signer
    let signer1: Signer
    let signer2: Signer
    let signer3: Signer
    let coreSigner1: Signer
	let coreSigner2: Signer
    let founderSigner1: Signer
	let founderSigner2: Signer
    

    let masterMinterAddr: Address
    let fundWalletAddr: Address
    let signer1Addr: Address
    let signer2Addr: Address
    let signer3Addr: Address
    let coreSigner1Addr: Address
	let coreSigner2Addr: Address
    let founder1Addr: Address
	let founder2Addr: Address

    const oneHundred = BigNumber.from(10).pow(18).mul(100);
    const oneUnit = BigNumber.from(10).pow(18);
    const _initialSupply =  oneUnit.mul(300).mul(1000000);
	const _totalSupply =  oneUnit.mul(300).mul(1000000);

    const founder = 2;
    const core = 1;
    const user = 0;

    let atlantisPaytoken: AtlantisPayToken

    beforeEach(async () => {
        [masterMinter, fundWallet, signer1, signer2, signer3, coreSigner1, coreSigner2, founderSigner1, founderSigner2] = await ethers.getSigners()
        masterMinterAddr = await masterMinter.getAddress()
        fundWalletAddr = await fundWallet.getAddress()
        signer1Addr = await signer1.getAddress()
        signer2Addr = await signer2.getAddress()
        signer3Addr = await signer3.getAddress()
        coreSigner1Addr = await coreSigner1.getAddress()
		coreSigner2Addr = await coreSigner2.getAddress()
        founder1Addr = await founderSigner1.getAddress()
		founder2Addr = await founderSigner2.getAddress()
        atlantisPaytoken = await deployAtlantisPayToken()
        await initializeLevels();
		await initializeBalances();
    })

    const initializeLevels = async () => {
        await atlantisPaytoken.changeLevel(
          founder1Addr,
          founder
        )

		await atlantisPaytoken.changeLevel(
			founder2Addr,
			founder
		  )
        
        await atlantisPaytoken.changeLevel(
          coreSigner1Addr,
          core
        )

		await atlantisPaytoken.changeLevel(
			coreSigner2Addr,
			core
		  )
    }

	const initializeBalances = async () => {
        await atlantisPaytoken.transfer(
			signer2Addr,
			oneUnit.mul(100)
		  )
  
		  await atlantisPaytoken.transfer(
			signer3Addr,
			oneUnit.mul(200)
		  )
  
		  await atlantisPaytoken.transfer(
			coreSigner1Addr,
			oneUnit.mul(250)
		  )

		  await atlantisPaytoken.transfer(
			coreSigner2Addr,
			oneUnit.mul(200)
		  )
  
		  await atlantisPaytoken.transfer(
			founder1Addr,
			oneUnit.mul(400)
		  )

		  await atlantisPaytoken.transfer(
			founder2Addr,
			oneUnit.mul(500)
		  )
    }

    const deployAtlantisPayToken = async (_signer?: Signer): Promise<AtlantisPayToken> => {
        const AtlantisPayTokenFactory = new AtlantisPayToken__factory(_signer || signer1)
        const AtlantisPayToken = await AtlantisPayTokenFactory.deploy(
            tokenName,
            tokenSymbol,
            fundWalletAddr,
            signer1Addr,
            _initialSupply
        )
        return AtlantisPayToken
    }

    it("initialize contract correctly", async () => {
        expect(await atlantisPaytoken.name()).to.equal("atlantisPaytoken")
        expect(await atlantisPaytoken.symbol()).to.equal("ADT")
        expect(await atlantisPaytoken.decimals()).to.equal(18)

        expect(await atlantisPaytoken.balanceOf(atlantisPaytoken.address)).to.equal(
          0
        )
		expect(await atlantisPaytoken.totalSupply()).to.equal(_initialSupply);
        expect(await atlantisPaytoken.fund_wallet()).to.equal(await fundWallet.getAddress());
    })

    it("initialize levels correctly", async () => {
        expect(
          await atlantisPaytoken.levelOf(coreSigner1Addr)
        ).to.equal(core)
        expect(
          await atlantisPaytoken.levelOf(founder1Addr)
        ).to.equal(founder)
    })

    it("initialize balances correctly", async () => {
        expect(
            await atlantisPaytoken.balanceOf(signer2Addr)
        ).to.equal(oneUnit.mul(100))
        expect(
            await atlantisPaytoken.balanceOf(signer3Addr)
        ).to.equal(oneUnit.mul(200))
        expect(
            await atlantisPaytoken.balanceOf(coreSigner1Addr)
        ).to.equal(oneUnit.mul(250))
		expect(
            await atlantisPaytoken.balanceOf(coreSigner2Addr)
        ).to.equal(oneUnit.mul(200))
        expect(
            await atlantisPaytoken.balanceOf(founder1Addr)
        ).to.equal(oneUnit.mul(400))
		expect(
            await atlantisPaytoken.balanceOf(founder2Addr)
        ).to.equal(oneUnit.mul(500))
		expect(await atlantisPaytoken.totalSupply()).to.equal(_totalSupply);
    })

    it("non owner accounts can't mint new tokens", async () => {
        let atlantisPaytokenS2 = atlantisPaytoken.connect(signer2)

        await expect(
            atlantisPaytokenS2.mintAndDistribute(
                oneHundred
            )
        ).to.be.revertedWith("PayToken: caller is not a minter")
    })

	it("non owner accounts can't change other account's level", async () => {
        let atlantisPaytokenS2 = atlantisPaytoken.connect(signer2)

        await expect(
            atlantisPaytokenS2.changeLevel(
				signer3Addr,
                founder
            )
        ).to.be.revertedWith("PayToken: caller is not the masterMinter")
    })

	it("can't change level of fund wallet", async () => {
        await expect(
            atlantisPaytoken.changeLevel(
				fundWalletAddr,
                founder
            )
        ).to.be.revertedWith("Distribution: can not change fund address level")
    })

	const epsilon = BigNumber.from(10);

    it("owner can mint new tokens and new tokens distribution is correct", async () => {
        await atlantisPaytoken.configureMinter(
            signer1Addr,
            oneUnit.mul(1000)
        )
        await atlantisPaytoken.mintAndDistribute(
            oneUnit.mul(1000)
        )

        expect(
            await atlantisPaytoken.balanceOf(founder1Addr)
        ).to.equal(oneUnit.mul(400).add(oneUnit.mul(250 * 4).div(9)))

		expect(
            await atlantisPaytoken.balanceOf(founder2Addr)
        ).to.equal(oneUnit.mul(500).add(oneUnit.mul(250 * 5).div(9)))

        expect(
            await atlantisPaytoken.balanceOf(coreSigner1Addr)
        ).to.equal(oneUnit.mul(250).add(oneUnit.mul(250 * 25).div(45)))

		expect(
            await atlantisPaytoken.balanceOf(coreSigner2Addr)
        ).to.equal(oneUnit.mul(200).add(oneUnit.mul(250 * 20).div(45)))

        expect(
            await atlantisPaytoken.balanceOf(fundWalletAddr)
        ).to.equal(oneUnit.mul(500))

		expect(await atlantisPaytoken.totalSupply()).to.equal(_totalSupply.add(oneUnit.mul(1000)));
    })

	it("mint, changing level from 0 to level 1, mint again works correctly", async () => {
        await atlantisPaytoken.configureMinter(
            signer1Addr,
            oneUnit.mul(3000)
        )
        await atlantisPaytoken.mintAndDistribute(
            oneUnit.mul(1000)
        )

		let oldBalanceCore1 =  await atlantisPaytoken.balanceOf(coreSigner1Addr);
		let oldBalanceCore2 = await atlantisPaytoken.balanceOf(coreSigner2Addr);
		let oldBalanceCore3 = await atlantisPaytoken.balanceOf(signer3Addr);
		let sumOldBalances = oldBalanceCore1.add(oldBalanceCore2).add(oldBalanceCore3);
        await atlantisPaytoken.changeLevel(
          signer3Addr,
          core
        )
		expect(
			await atlantisPaytoken.levelOf(signer3Addr)
		).to.equal(core)

		await atlantisPaytoken.mintAndDistribute(
            oneUnit.mul(2000)
        )
        
        expect(
            await atlantisPaytoken.balanceOf(fundWalletAddr)
        ).to.equal(oneUnit.mul(1500))

        expect(
            await atlantisPaytoken.balanceOf(coreSigner1Addr)
        ).to.be.closeTo(oldBalanceCore1.add(oneUnit.mul(500).mul(oldBalanceCore1).div(sumOldBalances)), epsilon)

		expect(
            await atlantisPaytoken.balanceOf(coreSigner2Addr)
        ).to.be.closeTo(oldBalanceCore2.add(oneUnit.mul(500).mul(oldBalanceCore2).div(sumOldBalances)), epsilon)

		expect(
            await atlantisPaytoken.balanceOf(signer3Addr)
        ).to.be.closeTo(oldBalanceCore3.add(oneUnit.mul(500).mul(oldBalanceCore3).div(sumOldBalances)), epsilon)


		expect(await atlantisPaytoken.totalSupply()).to.equal(_totalSupply.add(oneUnit.mul(3000)));

    })

	it("transfer between account and then mint works correctly", async () => {
		let atlantisPaytokenS2 = atlantisPaytoken.connect(signer2)
        await atlantisPaytokenS2.transfer(
			founder1Addr,
            oneUnit.mul(20)
        )

		let atlantisPaytokenF2 = atlantisPaytoken.connect(founderSigner2)
		await atlantisPaytokenF2.transfer(
			coreSigner1Addr,
            oneUnit.mul(50)
        )

		let atlantisPaytokenC2 = atlantisPaytoken.connect(coreSigner2)
		await atlantisPaytokenC2.transfer(
			coreSigner1Addr,
            oneUnit.mul(30)
        )

		expect(
            await atlantisPaytoken.balanceOf(signer2Addr)
        ).to.be.closeTo(oneUnit.mul(80), epsilon)

		expect(
            await atlantisPaytoken.balanceOf(founder1Addr)
        ).to.be.closeTo(oneUnit.mul(420), epsilon)

		expect(
            await atlantisPaytoken.balanceOf(founder2Addr)
        ).to.be.closeTo(oneUnit.mul(450), epsilon)

		expect(
            await atlantisPaytoken.balanceOf(coreSigner2Addr)
        ).to.be.closeTo(oneUnit.mul(170), epsilon)

		expect(
            await atlantisPaytoken.balanceOf(coreSigner1Addr)
        ).to.be.closeTo(oneUnit.mul(330), epsilon)

        await atlantisPaytoken.configureMinter(
            signer1Addr,
            oneUnit.mul(300)
        )

		await atlantisPaytoken.mintAndDistribute(
            oneUnit.mul(300)
        )
		
		expect(
            await atlantisPaytoken.balanceOf(founder1Addr)
        ).to.be.closeTo(oneUnit.mul(420).add(oneUnit.mul(420 * 75).div(870)), epsilon)

		expect(
            await atlantisPaytoken.balanceOf(founder2Addr)
        ).to.be.closeTo(oneUnit.mul(450).add(oneUnit.mul(450 * 75).div(870)), epsilon)

		expect(
            await atlantisPaytoken.balanceOf(coreSigner1Addr)
        ).to.be.closeTo(oneUnit.mul(330).add(oneUnit.mul(330 * 75).div(500)), epsilon)

		expect(
            await atlantisPaytoken.balanceOf(coreSigner2Addr)
        ).to.be.closeTo(oneUnit.mul(170).add(oneUnit.mul(170 * 75).div(500)), epsilon)

		expect(await atlantisPaytoken.totalSupply()).to.equal(_totalSupply.add(oneUnit.mul(300)));
    })

	it("mint to non regular shareholder works correctly", async () => {
        await atlantisPaytoken.configureMinter(
            signer1Addr,
            oneUnit.mul(30)
        )
		await atlantisPaytoken.mintForVIP(
			coreSigner2Addr,
            oneUnit.mul(30)
        );
        expect(
            await atlantisPaytoken.balanceOf(fundWalletAddr)
        ).to.equal(oneUnit.mul(60))

		expect(
            await atlantisPaytoken.balanceOf(founder1Addr)
        ).to.be.closeTo(oneUnit.mul(400).add(oneUnit.mul(30 * 4).div(9)), epsilon)

		expect(
            await atlantisPaytoken.balanceOf(founder2Addr)
        ).to.be.closeTo(oneUnit.mul(500).add(oneUnit.mul(30 * 5).div(9)), epsilon)

		expect(
            await atlantisPaytoken.balanceOf(coreSigner2Addr)
        ).to.be.closeTo(oneUnit.mul(230), epsilon)
		
		expect(await atlantisPaytoken.totalSupply()).to.equal(_totalSupply.add(oneUnit.mul(120)));
	})

	it("mint to regular shareholder works correctly", async () => {
        await atlantisPaytoken.configureMinter(
            signer1Addr,
            oneUnit.mul(30)
        )

		await atlantisPaytoken.mintForNormal(
			signer2Addr,
            oneUnit.mul(30)
        );
		    
		expect(
            await atlantisPaytoken.balanceOf(signer2Addr)
        ).to.be.closeTo(oneUnit.mul(130), epsilon)

		expect(
            await atlantisPaytoken.balanceOf(founder1Addr)
        ).to.be.closeTo(oneUnit.mul(400).add(oneUnit.mul(15 * 4).div(9)), epsilon)

		expect(
            await atlantisPaytoken.balanceOf(founder2Addr)
        ).to.be.closeTo(oneUnit.mul(500).add(oneUnit.mul(15 * 5).div(9)), epsilon)

		expect(
            await atlantisPaytoken.balanceOf(coreSigner1Addr)
        ).to.be.closeTo(oneUnit.mul(250).add(oneUnit.mul(15 * 25).div(45)), epsilon)

		expect(
            await atlantisPaytoken.balanceOf(coreSigner2Addr)
        ).to.be.closeTo(oneUnit.mul(200).add(oneUnit.mul(15 * 20).div(45)), epsilon)

		expect(await atlantisPaytoken.totalSupply()).to.equal(_totalSupply.add(oneUnit.mul(60)));

	})

	it("mint to regular shareholder doesn't work for non regular shareholders", async () => {
        await atlantisPaytoken.configureMinter(
            signer1Addr,
            oneUnit.mul(6000)
        ) 

		await expect ( atlantisPaytoken.mintForNormal(
			founder1Addr,
            oneUnit.mul(2000)
        )).to.be.revertedWith("Distribution: account is not normal");

		await expect ( atlantisPaytoken.mintForNormal(
			coreSigner1Addr,
            oneUnit.mul(2000)
        )).to.be.revertedWith("Distribution: account is not normal");

		await atlantisPaytoken.changeLevel(
			signer3Addr,
			core
		)

		await expect ( atlantisPaytoken.mintForNormal(
			signer3Addr,
            oneUnit.mul(2000)
        )).to.be.revertedWith("Distribution: account is not normal");

	})

	it("mint to non regular shareholder doesn't work for regular shareholders", async () => {
        await atlantisPaytoken.configureMinter(
            signer1Addr,
            oneUnit.mul(4000)
        )

		await expect ( atlantisPaytoken.mintForVIP(
			signer2Addr,
            oneUnit.mul(2000)
        )).to.be.revertedWith("Distribution: account is not VIP");

		await atlantisPaytoken.changeLevel(
			founder1Addr,
			user
		)

		await expect ( atlantisPaytoken.mintForVIP(
			founder1Addr,
            oneUnit.mul(2000)
        )).to.be.revertedWith("Distribution: account is not VIP");

	})

	it("burn and mint again works correctly", async () => {
        await atlantisPaytoken.configureMinter(
            founder1Addr,
            oneUnit.mul(100)
        )

        expect(
            await atlantisPaytoken.isMinter(founder1Addr)
        ).to.equal(true)

        let atlantisPaytokenF1 = atlantisPaytoken.connect(founderSigner1)

		await atlantisPaytokenF1.burn(
            oneUnit.mul(100)
        )


		expect(
            await atlantisPaytoken.balanceOf(founder1Addr)
        ).to.be.closeTo(oneUnit.mul(300), epsilon)

        await atlantisPaytoken.configureMinter(
            signer1Addr,
            oneUnit.mul(300)
        )

		await atlantisPaytoken.mintAndDistribute(
            oneUnit.mul(300)
        )

		expect(
            await atlantisPaytoken.balanceOf(founder1Addr)
        ).to.be.closeTo(oneUnit.mul(300).add(oneUnit.mul(75 * 3).div(8)), epsilon)

		expect(
            await atlantisPaytoken.balanceOf(founder2Addr)
        ).to.be.closeTo(oneUnit.mul(500).add(oneUnit.mul(75 * 5).div(8)), epsilon)

		expect(await atlantisPaytoken.totalSupply()).to.equal(_totalSupply.add(oneUnit.mul(200)));
	})
	
})

