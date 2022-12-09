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
                  // Set the user's mood to "happy"
                  await moodDiary.setMood("happy")
                  // Get the user's most recent mood
                  const mostRecentMood = await moodDiary.getMostRecentMood()

                  // Expect the most recent mood to be "happy"
                  expect(mostRecentMood.mood).to.equal("happy")
              })

              it("should not allow empty mood strings", async () => {
                  // Try to set the user's mood to an empty string
                  try {
                      await moodDiary.setMood("")
                  } catch (error) {
                      // Expect the transaction to fail
                      expect(error.message).to.contain("Mood cannot be empty")
                  }
              })

              it("should not allow mood strings longer than the maximum length", async () => {
                  // Try to set the user's mood to a string that is too long
                  try {
                      const longMood = "a".repeat(101)
                      await moodDiary.setMood(longMood)
                  } catch (error) {
                      // Expect the transaction to fail
                      expect(error.message).to.contain("Mood is too long")
                  }
              })
          })

          // Test the getMostRecentMood function
          describe("getMostRecentMood", () => {
              it("should return the user's most recent mood", async () => {
                  // Set the user's mood to "happy"
                  await moodDiary.setMood("happy")

                  // Get the user's most recent mood
                  const mostRecentMood = await moodDiary.getMostRecentMood()

                  // Expect the most recent mood to be "happy"
                  expect(mostRecentMood.mood).to.equal("happy")
              })
          })
      })
