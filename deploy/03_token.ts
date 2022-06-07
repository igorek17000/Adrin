import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import config from 'config'

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    // const { deployments, getNamedAccounts } = hre
    // const { deploy } = deployments
    // const { deployer } = await getNamedAccounts()

    // const tokenName = config.get("token_name")
    // const tokenSymbol = config.get("token_symbol")
    // const tokenDecimal = config.get("token_decimal")
    // const tokenTotalSupply = config.get("token_total_supply")
    // const tokenOwner = config.get("token_owner")

    // await deploy("ERC20Token", {
    //     from: deployer,
    //     log: true,
    //     skipIfAlreadyDeployed: true,
    //     args: [
    //         tokenName,
    //         tokenSymbol,
    //         tokenDecimal,
    //         tokenTotalSupply,
    //         tokenOwner
    //     ],
    // })
}

export default func
func.tags = ["Token", "Final"]
