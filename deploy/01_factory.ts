import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import config from 'config'

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    await deploy("Factory", {
        from: deployer,
        log: true,
        skipIfAlreadyDeployed: true,
        args: [],
    })

    const tokenName = config.get("stable_token_name")
    const tokenSymbol = config.get("stable_token_symbol")
    const tokenDecimal = config.get("stable_token_decimal")
    const tokenTotalSupply = config.get("stable_token_total_supply")
    const tokenOwner = config.get("stable_token_owner")

    await deploy("ERC20Token", {
        from: deployer,
        log: true,
        skipIfAlreadyDeployed: true,
        args: [
            tokenName,
            tokenSymbol,
            tokenDecimal,
            tokenTotalSupply,
            tokenOwner
        ],
    })
}

export default func
func.tags = ["Factory", "Final"]