import { expect, use } from "chai"
import { ethers } from "hardhat"
import { Signer, BigNumber, BigNumberish } from "ethers"
import { Address } from "hardhat-deploy/dist/types";
import { solidity, MockProvider } from "ethereum-waffle"

import { AtlantisPayToken } from "../src/types/AtlantisPayToken"
import { AtlantisPayToken__factory } from "../src/types/factories/AtlantisPayToken__factory"

use(solidity)

describe("AtlantisPayToken", async () => {
    let tokenName = "AtlantisPay"
    let tokenSymbol = "APT"
    let tokenCurrency = "NullCurrency"

    let masterMinter: Signer
    let signer1: Signer
    let signer2: Signer
    let signer3: Signer
    let signer4: Signer
    let vip1: Signer
    let vip2: Signer

    let masterMinterAddr: Address
    let signer1Addr: Address
    let signer2Addr: Address
    let signer3Addr: Address
    let signer4Addr: Address
    let vip1Addr: Address
    let vip2Addr: Address

    const oneUnit = BigNumber.from(10).pow(18);
    const _initialSupply =  oneUnit.mul(300).mul(1000000);
    const oneHundred = BigNumber.from(10).pow(18).mul(100);
    const theReferralCode = BigNumber.from(10).pow(3).mul(12334455);


    let atlantisPayToken: AtlantisPayToken

    beforeEach(async () => {
        [masterMinter, signer1, signer2, signer3, signer4, vip1, vip2] = await ethers.getSigners()
        masterMinterAddr = await masterMinter.getAddress()
        signer1Addr = await signer1.getAddress()
        signer2Addr = await signer2.getAddress()
        signer3Addr = await signer3.getAddress()
        signer4Addr = await signer4.getAddress()
        vip1Addr = await vip1.getAddress()
        vip2Addr = await vip2.getAddress()
        
        atlantisPayToken = await deployAtlantisPayToken()
        await setVIPaccounts()
    })

    const setVIPaccounts = async () => {
        let atlantisPayTokenMM = atlantisPayToken.connect(masterMinter)
        expect(
            await atlantisPayTokenMM.changeLevel(vip1Addr, 1)
        ).to.emit(atlantisPayTokenMM, "ChangeLevel")
        expect(
            await atlantisPayTokenMM.changeLevel(vip2Addr, 2)
        ).to.emit(atlantisPayTokenMM, "ChangeLevel")

        await atlantisPayToken.transfer(
            vip1Addr,
            oneHundred.mul(2)
        )

        await atlantisPayToken.transfer(
            vip2Addr,
            oneHundred.mul(3)
        )
    }

    const deployAtlantisPayToken = async (_signer?: Signer): Promise<AtlantisPayToken> => {
        const atlantisPayTokenFactory = new AtlantisPayToken__factory(_signer || signer1)
        const atlantisPayToken = await atlantisPayTokenFactory.deploy(
            tokenName,
            tokenSymbol,
            signer1Addr,
            masterMinterAddr,
            _initialSupply
        )
        return atlantisPayToken
    }

    it("initialize contract correctly", async () => {
        expect(await atlantisPayToken.name()).to.equal("AtlantisPay")
        expect(await atlantisPayToken.symbol()).to.equal("APT")
        expect(await atlantisPayToken.decimals()).to.equal(18)

        expect(await atlantisPayToken.balanceOf(atlantisPayToken.address)).to.equal(
            0
        )
    })

    it("non master minter can not add new minters", async () => {
        let atlantisPayTokenS2 = atlantisPayToken.connect(signer2)

        await expect(
            atlantisPayTokenS2.configureMinter(
                signer3Addr,
                oneHundred
            )
        ).to.be.revertedWith("PayToken: caller is not the masterMinter")
    })

    it("master minter can add new minters", async () => {
        let atlantisPayTokenMM = atlantisPayToken.connect(masterMinter)

        await atlantisPayTokenMM.configureMinter(
            signer3Addr,
            oneHundred
        )

        expect(
            await atlantisPayToken.minterAllowance(signer3Addr)
        ).to.equal(oneHundred)

        expect(
            await atlantisPayToken.isMinter(signer3Addr)
        ).to.equal(true)
    })

    it("non master minter can not remove a minter", async () => {
        let atlantisPayTokenMM = atlantisPayToken.connect(masterMinter)

        await atlantisPayTokenMM.configureMinter(
            signer3Addr,
            oneHundred
        )

        expect(
            await atlantisPayToken.isMinter(signer3Addr)
        ).to.equal(true)

        let atlantisPayTokenS2 = atlantisPayToken.connect(signer2)

        await expect(
            atlantisPayTokenS2.removeMinter(signer3Addr)
        ).to.be.revertedWith("PayToken: caller is not the masterMinter")
    })

    it("master minter can remove a minter", async () => {
        let atlantisPayTokenMM = atlantisPayToken.connect(masterMinter)

        await atlantisPayTokenMM.configureMinter(
            signer3Addr,
            oneHundred
        )

        expect(
            await atlantisPayToken.isMinter(signer3Addr)
        ).to.equal(true)

        await atlantisPayTokenMM.removeMinter(signer3Addr)

        expect(
            await atlantisPayToken.isMinter(signer3Addr)
        ).to.equal(false)
    })

    it("only owner can update master minter", async () => {
        let atlantisPayTokenS2 = atlantisPayToken.connect(signer2)

        await expect(
            atlantisPayTokenS2.updateMasterMinter(
                signer3Addr
            )
        ).to.be.revertedWith("Ownable: caller is not the owner")


        let atlantisPayTokenS1 = atlantisPayToken.connect(signer1)

        await atlantisPayTokenS1.updateMasterMinter(signer3Addr)

        expect(
            await atlantisPayToken.theMasterMinter()
        ).to.equal(signer3Addr)
    })

    it("non minters can not mint new tokens", async () => {
        let atlantisPayTokenMM = atlantisPayToken.connect(masterMinter)

        await atlantisPayTokenMM.configureMinter(
            signer3Addr,
            oneHundred.mul(4)
        )

        let atlantisPayTokenS4 = atlantisPayToken.connect(signer4)

        await expect(
            atlantisPayTokenS4.mintAndDistribute(
                oneHundred.mul(4)
            )
        ).to.be.revertedWith("PayToken: caller is not a minter")

    })

    // it("minters can mint new tokens", async () => {
    //     let atlantisPayTokenMM = atlantisPayToken.connect(masterMinter)

    //     await atlantisPayTokenMM.configureMinter(
    //         signer3Addr,
    //         oneHundred.mul(4)
    //     )

    //     let atlantisPayTokenS3 = atlantisPayToken.connect(signer3)

    //     await atlantisPayTokenS3.mintAndDistribute(
    //         oneHundred.mul(4)
    //     )

    //     expect(
    //         await atlantisPayToken.balanceOf(signer4Addr)
    //     ).to.equal(oneHundred)

    // })

    it("non minters can not burn tokens", async () => {
        let atlantisPayTokenMM = atlantisPayToken.connect(masterMinter)

        await atlantisPayTokenMM.configureMinter(
            signer3Addr,
            oneHundred
        )

        let atlantisPayTokenS4 = atlantisPayToken.connect(signer4)

        await expect(
            atlantisPayTokenS4.burn(
                oneHundred
            )
        ).to.be.revertedWith("PayToken: caller is not a minter")

    })

    // it("minters can burn tokens", async () => {
    //     let atlantisPayTokenMM = atlantisPayToken.connect(masterMinter)

    //     await atlantisPayTokenMM.configureMinter(
    //         signer3Addr,
    //         oneHundred.mul(4)
    //     )

    //     let atlantisPayTokenS3 = atlantisPayToken.connect(signer3)

    //     await atlantisPayTokenS3.mintAndDistribute(
    //         oneHundred.mul(4)
    //     )

    //     expect(
    //         await atlantisPayToken.balanceOf(signer3Addr)
    //     ).to.equal(oneHundred)

    //     expect(
    //         await atlantisPayTokenS3.burn(oneHundred)
    //     ).to.emit(atlantisPayToken, "Burn")

    // })

    it("transferWithReferralCode", async () => {
        await atlantisPayToken.transfer(
            signer4Addr,
            oneHundred.mul(2)
        )

        let atlantisPayTokenS4 = atlantisPayToken.connect(signer4)

        expect(
            await atlantisPayTokenS4.transferWithReferralCode(
                signer1Addr,
                oneHundred,
                theReferralCode
            )
        ).to.emit(atlantisPayToken, "TransferWithReferralCode")

    })

    it("transferFromWithReferralCode", async () => {
        await atlantisPayToken.transfer(
            signer4Addr,
            oneHundred.mul(2)
        )

        let atlantisPayTokenS4 = atlantisPayToken.connect(signer4)

        await atlantisPayTokenS4.approve(signer2Addr, oneHundred)

        let atlantisPayTokenS2 = atlantisPayToken.connect(signer2)

        expect(
            await atlantisPayTokenS2.transferFromWithReferralCode(
                signer4Addr,
                signer1Addr,
                oneHundred,
                theReferralCode
            )
        ).to.emit(atlantisPayToken, "TransferWithReferralCode")

    })

    it("mint for VIP", async () => {
        let atlantisPayTokenMM = atlantisPayToken.connect(masterMinter)

        await atlantisPayTokenMM.configureMinter(
            signer3Addr,
            oneHundred.mul(4)
        )

        let atlantisPayTokenS3 = atlantisPayToken.connect(signer3)

        expect(
            await atlantisPayTokenS3.mintForVIP(
                vip1Addr,
                oneHundred.mul(2)
            )
        ).to.emit(atlantisPayTokenS3, "MintForVIP")
    })

    it("mint for normal", async () => {
        let atlantisPayTokenMM = atlantisPayToken.connect(masterMinter)

        await atlantisPayTokenMM.configureMinter(
            signer3Addr,
            oneHundred.mul(4)
        )

        let atlantisPayTokenS3 = atlantisPayToken.connect(signer3)

        expect(
            await atlantisPayTokenS3.mintForNormal(
                signer4Addr,
                oneHundred.mul(2)
            )
        ).to.emit(atlantisPayTokenS3, "MintForNormal")
    })
})
