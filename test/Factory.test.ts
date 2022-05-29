// import { expect, use } from "chai"
// import { deployments, ethers } from "hardhat"
// import { Signer, BigNumber, BigNumberish } from "ethers"
// import { Address } from "hardhat-deploy/dist/types";
// import { solidity, MockProvider } from "ethereum-waffle"
// import { ERC20Token, Factory, Governable } from "../src/types"
// import config from 'config'
// import getContractAddress from "@ethersproject/address"

// use(solidity)

// describe("factory", async () => {
//     let deployer: Signer
//     let signer1: Signer
//     let signer2: Signer
//     let signer3: Signer

//     let deployerAddr: Address
//     let signer1Addr: Address
//     let signer2Addr: Address
//     let signer3Addr: Address

//     const oneUnit = BigNumber.from(10).pow(18);

//     let factory: Factory
//     let stableCoin: ERC20Token

//     const tokenName: string = config.get("agreement_token_name")
//     const tokenSymbol: string = config.get("agreement_token_symbol")
//     const tokenDecimal: string = config.get("agreement_token_decimal")
//     const tokenTotalSupply: string = config.get("agreement_token_total_supply")
//     const agreementQuorum: string = config.get("agreement_quorum")
//     const agreementVoters: string[] = config.get("agreement_voters")
//     const agreementMaxDelay: string = config.get("agreement_max_delat")


//     beforeEach(async () => {
//         [deployer, signer1, signer2, signer3] = await ethers.getSigners()
//         deployerAddr = await deployer.getAddress()
//         signer1Addr = await signer1.getAddress()
//         signer2Addr = await signer2.getAddress()
//         signer3Addr = await signer3.getAddress()

//         await deployments.fixture(["Factory"])
//         factory = await ethers.getContract("Factory");
//         stableCoin = await ethers.getContract("ERC20Token");
//     })

    
//     it("initialize contract correctly", async () => {
//         expect(await factory.owner()).to.equal(deployerAddr);
//     })

//     it("non owner accounts can't add new operator", async () => {
//         let factoryS1 = factory.connect(signer1)

//         await expect(
//              factoryS1.addOperator(
//                 signer2Addr
//             )
//         ).to.be.revertedWith("Ownable: caller is not the owner")
//     })

//     it("non owner accounts can't remove an operator", async () => {
//         let factoryS1 = factory.connect(signer1)

//         await expect(
//              factoryS1.addOperator(
//                 deployerAddr
//             )
//         ).to.be.revertedWith("Ownable: caller is not the owner")
//     })

//     const OwnerAddOperator = async (address: Address) => {
//         await expect(
//             factory.addOperator(
//                 address
//             )
//         ).to.emit(factory, "OperatorAdded")
//     }

//     const OwnerRemoveOperator = async (address: Address) => {
//         await expect(
//             factory.removeOperator(
//                 address
//             )
//         ).to.emit(factory, "OperatorRemoved")
//     }

//     const CheckIsOperator = async (address: Address, status: Boolean) => {
//         expect(
//             await factory.isOperator(
//                 address
//             )
//         ).to.equal(status)
//     }

//     it("owner can add a new operator and can remove it (event check) ", async () => {
//         await CheckIsOperator(signer2Addr, false)
//         await OwnerAddOperator(signer2Addr)
//         await CheckIsOperator(signer2Addr, true)
//         await OwnerRemoveOperator(signer2Addr);
//         await CheckIsOperator(signer2Addr, false);
//     })

//     it("non operator accounts can't deploy new agreement", async () => {
//         let factoryS1 = factory.connect(signer1)

//         await expect(
//             factoryS1.deployNewAgreement(
//                 tokenName,
//                 tokenSymbol,
//                 tokenDecimal,
//                 tokenTotalSupply,
//                 agreementQuorum,
//                 agreementVoters,
//                 agreementMaxDelay,
//                 stableCoin.address
//             )
//         ).to.be.revertedWith("OperatorRole: caller does not have the Operator role")
//     })
    
//     it("operator accounts can deploy new agreement", async () => {
//         await OwnerAddOperator(signer1Addr)
//         let factoryS1 = factory.connect(signer1)
//         let futureAddress;
        
//         futureAddress = ethers.utils.getContractAddress({
//             from: factory.address,
//             nonce: 1
//         })

//         await expect(
//             factoryS1.deployNewAgreement(
//                 tokenName,
//                 tokenSymbol,
//                 tokenDecimal,
//                 tokenTotalSupply,
//                 agreementQuorum,
//                 agreementVoters,
//                 agreementMaxDelay,
//                 stableCoin.address
//             )
//         ).to.emit(factory, "AgreementCreated").withArgs(futureAddress)
//     })

//     // const initializeLevels = async () => {
// 	// 	expect(
// 	// 		await atlantisPaytoken.changeLevel(
// 	// 			founder1Addr,
// 	// 			founder
// 	// 		)
// 	// 	).to.emit(atlantisPaytoken, "ChangeLevel");

// 	// 	expect(
// 	// 		await atlantisPaytoken.changeLevel(
// 	// 			founder2Addr,
// 	// 			founder
// 	// 		)
// 	// 	).to.emit(atlantisPaytoken, "ChangeLevel");

// 	// 	expect(
// 	// 		await atlantisPaytoken.changeLevel(
// 	// 			coreSigner1Addr,
// 	// 			core
// 	// 		)
// 	// 	).to.emit(atlantisPaytoken, "ChangeLevel");

// 	// 	expect(
// 	// 		await atlantisPaytoken.changeLevel(
// 	// 			coreSigner2Addr,
// 	// 			core
// 	// 		)
// 	// 	).to.emit(atlantisPaytoken, "ChangeLevel");
//     // }

// 	// const initializeBalances = async () => {
//     //     await atlantisPaytoken.transfer(
// 	// 		signer2Addr,
// 	// 		oneUnit.mul(100)
// 	// 	  )
  
// 	// 	  await atlantisPaytoken.transfer(
// 	// 		signer3Addr,
// 	// 		oneUnit.mul(200)
// 	// 	  )
  
// 	// 	  await atlantisPaytoken.transfer(
// 	// 		coreSigner1Addr,
// 	// 		oneUnit.mul(250)
// 	// 	  )

// 	// 	  await atlantisPaytoken.transfer(
// 	// 		coreSigner2Addr,
// 	// 		oneUnit.mul(200)
// 	// 	  )
  
// 	// 	  await atlantisPaytoken.transfer(
// 	// 		founder1Addr,
// 	// 		oneUnit.mul(400)
// 	// 	  )

// 	// 	  await atlantisPaytoken.transfer(
// 	// 		founder2Addr,
// 	// 		oneUnit.mul(500)
// 	// 	  )
//     // }
   
//     // it("initialize levels correctly", async () => {
//     //     expect(
//     //       await atlantisPaytoken.levelOf(coreSigner1Addr)
//     //     ).to.equal(core)
//     //     expect(
//     //       await atlantisPaytoken.levelOf(founder1Addr)
//     //     ).to.equal(founder)
//     // })

//     // it("initialize balances correctly", async () => {
//     //     expect(
//     //         await atlantisPaytoken.balanceOf(signer2Addr)
//     //     ).to.equal(oneUnit.mul(100))
//     //     expect(
//     //         await atlantisPaytoken.balanceOf(signer3Addr)
//     //     ).to.equal(oneUnit.mul(200))
//     //     expect(
//     //         await atlantisPaytoken.balanceOf(coreSigner1Addr)
//     //     ).to.equal(oneUnit.mul(250))
// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(coreSigner2Addr)
//     //     ).to.equal(oneUnit.mul(200))
//     //     expect(
//     //         await atlantisPaytoken.balanceOf(founder1Addr)
//     //     ).to.equal(oneUnit.mul(400))
// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(founder2Addr)
//     //     ).to.equal(oneUnit.mul(500))
// 	// 	expect(await atlantisPaytoken.totalSupply()).to.equal(_totalSupply);
//     // })

// 	// it("non owner accounts can't change other account's level", async () => {
//     //     let atlantisPaytokenS2 = atlantisPaytoken.connect(signer2)
//     //     await expect(
//     //         atlantisPaytokenS2.changeLevel(
// 	// 			signer3Addr,
//     //             founder
//     //         )
//     //     ).to.be.revertedWith("PayToken: caller is not the masterMinter")
//     // })

// 	// it("can't change level of fund wallet", async () => {
//     //     await expect(
//     //         atlantisPaytoken.changeLevel(
// 	// 			fundWalletAddr,
//     //             founder
//     //         )
//     //     ).to.be.revertedWith("Distribution: can not change fund address level")
//     // })

// 	// const epsilon = BigNumber.from(10);

//     // it("owner can mint new tokens and new tokens distribution is correct", async () => {
//     //     await atlantisPaytoken.configureMinter(
//     //         signer1Addr,
//     //         oneUnit.mul(1000)
//     //     )
//     //     await atlantisPaytoken.mintAndDistribute(
//     //         oneUnit.mul(1000)
//     //     )

//     //     expect(
//     //         await atlantisPaytoken.balanceOf(founder1Addr)
//     //     ).to.equal(oneUnit.mul(400).add(oneUnit.mul(250 * 4).div(9)))

// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(founder2Addr)
//     //     ).to.equal(oneUnit.mul(500).add(oneUnit.mul(250 * 5).div(9)))

//     //     expect(
//     //         await atlantisPaytoken.balanceOf(coreSigner1Addr)
//     //     ).to.equal(oneUnit.mul(250).add(oneUnit.mul(250 * 25).div(45)))

// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(coreSigner2Addr)
//     //     ).to.equal(oneUnit.mul(200).add(oneUnit.mul(250 * 20).div(45)))

//     //     expect(
//     //         await atlantisPaytoken.balanceOf(fundWalletAddr)
//     //     ).to.equal(oneUnit.mul(500))

// 	// 	expect(await atlantisPaytoken.totalSupply()).to.equal(_totalSupply.add(oneUnit.mul(1000)));
//     // })

// 	// it("mint, changing level from 0 to level 1, mint again works correctly", async () => {
//     //     await atlantisPaytoken.configureMinter(
//     //         signer1Addr,
//     //         oneUnit.mul(3000)
//     //     )
//     //     await atlantisPaytoken.mintAndDistribute(
//     //         oneUnit.mul(1000)
//     //     )

// 	// 	let oldBalanceCore1 =  await atlantisPaytoken.balanceOf(coreSigner1Addr);
// 	// 	let oldBalanceCore2 = await atlantisPaytoken.balanceOf(coreSigner2Addr);
// 	// 	let oldBalanceCore3 = await atlantisPaytoken.balanceOf(signer3Addr);
// 	// 	let sumOldBalances = oldBalanceCore1.add(oldBalanceCore2).add(oldBalanceCore3);
//     //     await atlantisPaytoken.changeLevel(
//     //       signer3Addr,
//     //       core
//     //     )
// 	// 	expect(
// 	// 		await atlantisPaytoken.levelOf(signer3Addr)
// 	// 	).to.equal(core)

// 	// 	await atlantisPaytoken.mintAndDistribute(
//     //         oneUnit.mul(2000)
//     //     )
        
//     //     expect(
//     //         await atlantisPaytoken.balanceOf(fundWalletAddr)
//     //     ).to.equal(oneUnit.mul(1500))

//     //     expect(
//     //         await atlantisPaytoken.balanceOf(coreSigner1Addr)
//     //     ).to.be.closeTo(oldBalanceCore1.add(oneUnit.mul(500).mul(oldBalanceCore1).div(sumOldBalances)), epsilon)

// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(coreSigner2Addr)
//     //     ).to.be.closeTo(oldBalanceCore2.add(oneUnit.mul(500).mul(oldBalanceCore2).div(sumOldBalances)), epsilon)

// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(signer3Addr)
//     //     ).to.be.closeTo(oldBalanceCore3.add(oneUnit.mul(500).mul(oldBalanceCore3).div(sumOldBalances)), epsilon)


// 	// 	expect(await atlantisPaytoken.totalSupply()).to.equal(_totalSupply.add(oneUnit.mul(3000)));

//     // })

// 	// it("transfer between account and then mint works correctly", async () => {
// 	// 	let atlantisPaytokenS2 = atlantisPaytoken.connect(signer2)
//     //     await atlantisPaytokenS2.transfer(
// 	// 		founder1Addr,
//     //         oneUnit.mul(20)
//     //     )

// 	// 	let atlantisPaytokenF2 = atlantisPaytoken.connect(founderSigner2)
// 	// 	await atlantisPaytokenF2.transfer(
// 	// 		coreSigner1Addr,
//     //         oneUnit.mul(50)
//     //     )

// 	// 	let atlantisPaytokenC2 = atlantisPaytoken.connect(coreSigner2)
// 	// 	await atlantisPaytokenC2.transfer(
// 	// 		coreSigner1Addr,
//     //         oneUnit.mul(30)
//     //     )

// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(signer2Addr)
//     //     ).to.be.closeTo(oneUnit.mul(80), epsilon)

// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(founder1Addr)
//     //     ).to.be.closeTo(oneUnit.mul(420), epsilon)

// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(founder2Addr)
//     //     ).to.be.closeTo(oneUnit.mul(450), epsilon)

// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(coreSigner2Addr)
//     //     ).to.be.closeTo(oneUnit.mul(170), epsilon)

// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(coreSigner1Addr)
//     //     ).to.be.closeTo(oneUnit.mul(330), epsilon)

//     //     await atlantisPaytoken.configureMinter(
//     //         signer1Addr,
//     //         oneUnit.mul(300)
//     //     )

// 	// 	await atlantisPaytoken.mintAndDistribute(
//     //         oneUnit.mul(300)
//     //     )
		
// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(founder1Addr)
//     //     ).to.be.closeTo(oneUnit.mul(420).add(oneUnit.mul(420 * 75).div(870)), epsilon)

// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(founder2Addr)
//     //     ).to.be.closeTo(oneUnit.mul(450).add(oneUnit.mul(450 * 75).div(870)), epsilon)

// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(coreSigner1Addr)
//     //     ).to.be.closeTo(oneUnit.mul(330).add(oneUnit.mul(330 * 75).div(500)), epsilon)

// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(coreSigner2Addr)
//     //     ).to.be.closeTo(oneUnit.mul(170).add(oneUnit.mul(170 * 75).div(500)), epsilon)

// 	// 	expect(await atlantisPaytoken.totalSupply()).to.equal(_totalSupply.add(oneUnit.mul(300)));
//     // })

// 	// it("mint to non regular shareholder works correctly", async () => {
//     //     await atlantisPaytoken.configureMinter(
//     //         signer1Addr,
//     //         oneUnit.mul(30)
//     //     )
// 	// 	await atlantisPaytoken.mintForVIP(
// 	// 		coreSigner2Addr,
//     //         oneUnit.mul(30)
//     //     );
//     //     expect(
//     //         await atlantisPaytoken.balanceOf(fundWalletAddr)
//     //     ).to.equal(oneUnit.mul(60))

// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(founder1Addr)
//     //     ).to.be.closeTo(oneUnit.mul(400).add(oneUnit.mul(30 * 4).div(9)), epsilon)

// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(founder2Addr)
//     //     ).to.be.closeTo(oneUnit.mul(500).add(oneUnit.mul(30 * 5).div(9)), epsilon)

// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(coreSigner2Addr)
//     //     ).to.be.closeTo(oneUnit.mul(230), epsilon)
		
// 	// 	expect(await atlantisPaytoken.totalSupply()).to.equal(_totalSupply.add(oneUnit.mul(120)));
// 	// })

// 	// it("mint to regular shareholder works correctly", async () => {
//     //     await atlantisPaytoken.configureMinter(
//     //         signer1Addr,
//     //         oneUnit.mul(30)
//     //     )

// 	// 	await atlantisPaytoken.mintForNormal(
// 	// 		signer2Addr,
//     //         oneUnit.mul(30)
//     //     );
		    
// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(signer2Addr)
//     //     ).to.be.closeTo(oneUnit.mul(130), epsilon)

// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(founder1Addr)
//     //     ).to.be.closeTo(oneUnit.mul(400).add(oneUnit.mul(15 * 4).div(9)), epsilon)

// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(founder2Addr)
//     //     ).to.be.closeTo(oneUnit.mul(500).add(oneUnit.mul(15 * 5).div(9)), epsilon)

// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(coreSigner1Addr)
//     //     ).to.be.closeTo(oneUnit.mul(250).add(oneUnit.mul(15 * 25).div(45)), epsilon)

// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(coreSigner2Addr)
//     //     ).to.be.closeTo(oneUnit.mul(200).add(oneUnit.mul(15 * 20).div(45)), epsilon)

// 	// 	expect(await atlantisPaytoken.totalSupply()).to.equal(_totalSupply.add(oneUnit.mul(60)));

// 	// })

// 	// it("mint to regular shareholder doesn't work for non regular shareholders", async () => {
//     //     await atlantisPaytoken.configureMinter(
//     //         signer1Addr,
//     //         oneUnit.mul(6000)
//     //     ) 

// 	// 	await expect ( atlantisPaytoken.mintForNormal(
// 	// 		founder1Addr,
//     //         oneUnit.mul(2000)
//     //     )).to.be.revertedWith("Distribution: account is not normal");

// 	// 	await expect ( atlantisPaytoken.mintForNormal(
// 	// 		coreSigner1Addr,
//     //         oneUnit.mul(2000)
//     //     )).to.be.revertedWith("Distribution: account is not normal");

// 	// 	await atlantisPaytoken.changeLevel(
// 	// 		signer3Addr,
// 	// 		core
// 	// 	)

// 	// 	await expect ( atlantisPaytoken.mintForNormal(
// 	// 		signer3Addr,
//     //         oneUnit.mul(2000)
//     //     )).to.be.revertedWith("Distribution: account is not normal");

// 	// })

// 	// it("mint to non regular shareholder doesn't work for regular shareholders", async () => {
//     //     await atlantisPaytoken.configureMinter(
//     //         signer1Addr,
//     //         oneUnit.mul(4000)
//     //     )

// 	// 	await expect ( atlantisPaytoken.mintForVIP(
// 	// 		signer2Addr,
//     //         oneUnit.mul(2000)
//     //     )).to.be.revertedWith("Distribution: account is not VIP");

// 	// 	await atlantisPaytoken.changeLevel(
// 	// 		founder1Addr,
// 	// 		user
// 	// 	)

// 	// 	await expect ( atlantisPaytoken.mintForVIP(
// 	// 		founder1Addr,
//     //         oneUnit.mul(2000)
//     //     )).to.be.revertedWith("Distribution: account is not VIP");

// 	// })

// 	// it("burn and mint again works correctly", async () => {
//     //     await atlantisPaytoken.configureMinter(
//     //         founder1Addr,
//     //         oneUnit.mul(100)
//     //     )

//     //     expect(
//     //         await atlantisPaytoken.isMinter(founder1Addr)
//     //     ).to.equal(true)

//     //     let atlantisPaytokenF1 = atlantisPaytoken.connect(founderSigner1)

// 	// 	await atlantisPaytokenF1.burn(
//     //         oneUnit.mul(100)
//     //     )


// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(founder1Addr)
//     //     ).to.be.closeTo(oneUnit.mul(300), epsilon)

//     //     await atlantisPaytoken.configureMinter(
//     //         signer1Addr,
//     //         oneUnit.mul(300)
//     //     )

// 	// 	await atlantisPaytoken.mintAndDistribute(
//     //         oneUnit.mul(300)
//     //     )

// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(founder1Addr)
//     //     ).to.be.closeTo(oneUnit.mul(300).add(oneUnit.mul(75 * 3).div(8)), epsilon)

// 	// 	expect(
//     //         await atlantisPaytoken.balanceOf(founder2Addr)
//     //     ).to.be.closeTo(oneUnit.mul(500).add(oneUnit.mul(75 * 5).div(8)), epsilon)

// 	// 	expect(await atlantisPaytoken.totalSupply()).to.equal(_totalSupply.add(oneUnit.mul(200)));
// 	// })
	
// })

