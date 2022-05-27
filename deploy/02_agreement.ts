import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import config from 'config'

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    // const { deployments, getNamedAccounts } = hre
    // const { deploy } = deployments
    // const { deployer } = await getNamedAccounts()

    // const tokenName = "AtlantisPayToken"
    // const tokenSymbol = "ATPT"
    // const fundingAddress = config.get("funding_address")

    // await deploy("AtlantisDistribution", {
    //     from: deployer,
    //     log: true,
    //     skipIfAlreadyDeployed: true,
    //     args: [
    //         tokenName,
    //         tokenSymbol,
    //         fundingAddress
    //     ],
    // })
}

export default func
export const tags = ["Agreement"]
