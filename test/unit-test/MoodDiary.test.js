const { assert, expect } = require("chai")

const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const web3 = require("web3")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("MoodDiary", async function () {
          let moodDiary, deployer, otherUser
          const chainId = network.config.chainId

          const MAX_MOOD_LENGTH = 100

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              otherUser = (await getNamedAccounts()).otherUser
              await deployments.fixture(["all"])
              moodDiary = await ethers.getContract("MoodDiary", deployer)
              console.log("Contract deployed, ready for testing")
          })

          describe("setMood", function () {
              it("should set the user's mood to the provided mood string", async () => {
                  // Set the user's mood to "happy", but we need to convert to bytes !
                  await moodDiary.setMood(web3.utils.toHex("happy"))
                  // Get the user's most recent mood
                  const mostRecentMood = await moodDiary.getMostRecentMood()

                  // Expect the most recent mood to be "happy"
                  expect(mostRecentMood.mood).to.equal("happy")
              })
          })
      })
