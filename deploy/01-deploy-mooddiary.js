const { deployments, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployment }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    // const chainId = network.config.chainId

    const lottery = await deploy("MoodDiary", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    log("Contract MoodDiary deployed")

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying the contract ...")
        const args = []
        await verify(lottery.address, args)
    }
    log("Contract verified!")
}

module.exports.tags = ["all", "mooddiary"]
