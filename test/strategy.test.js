const { expect, use } = require("chai");
const chaiAsPromised = require("chai-as-promised");
const sinon = require("sinon");
const {
  impersonateAccount,
  stopImpersonatingAccount,
  setBalance,
  takeSnapshot,
} = require("@nomicfoundation/hardhat-network-helpers");

const { Strategy } = require("../src/common/strategy");

const { forceTransfer } = require("./utils");
const {
  LP_SAFE_ADDRESS,
  ADMIN_SAFE_ADDRESS,
  THREEPOOL_STABLESWAP_ADDRESS,
  LP_ACCOUNT_ADDRESS,
  DAI_ADDRESS,
  USDC_ADDRESS,
  USDT_ADDRESS,
  RESERVE_POOLS,
} = require("../src/common/constants");

const erc20Abi = require("../src/abis/ERC20.json");
const poolTokenAbi = require("../src/abis/PoolTokenV3.json");

use(chaiAsPromised);

describe("Index strategy", () => {
  let snapshot;
  let signer;

  beforeEach(async () => {
    snapshot = await takeSnapshot();
  });

  afterEach(async () => {
    await snapshot.restore();
  });

  afterEach(() => {
    sinon.restore();
  });

  before(async () => {
    [signer] = await ethers.getSigners();
  });

  before(() => {
    strategy = new Strategy(signer);
  });

  describe("getUnderlyersWithNetExcess", () => {
    it("should return an empty array if every token's rebalance amount is greater its balance", () => {
      const reserveAddresses = Object.keys(RESERVE_POOLS);

      const rebalanceAmounts = [
        { address: reserveAddresses[0], amount: 50000n },
        { address: reserveAddresses[1], amount: 50000n },
        { address: reserveAddresses[2], amount: 50000n },
      ];

      const reserveValues = Object.values(RESERVE_POOLS);

      const balances = {
        [reserveValues[0].underlyer]: 10000n,
        [reserveValues[1].underlyer]: 10000n,
        [reserveValues[2].underlyer]: 10000n,
      };

      const netExcessAmounts = strategy.getUnderlyersWithNetExcess(
        rebalanceAmounts,
        balances
      );

      expect(netExcessAmounts).to.be.empty;
    });

    it("should calculate the difference between the token's balance and the rebalance amount", () => {
      const reserveAddresses = Object.keys(RESERVE_POOLS);

      const rebalanceAmounts = [
        { address: reserveAddresses[0], amount: 10000n },
        { address: reserveAddresses[1], amount: 10000n },
        { address: reserveAddresses[2], amount: 10000n },
      ];

      const reserveValues = Object.values(RESERVE_POOLS);

      const balances = {
        [reserveValues[0].underlyer]: 50000n,
        [reserveValues[1].underlyer]: 50000n,
        [reserveValues[2].underlyer]: 50000n,
      };

      const netExcessAmounts = strategy.getUnderlyersWithNetExcess(
        rebalanceAmounts,
        balances
      );

      const underlying = Object.keys(balances);

      const expectedNetExcessAmounts = [
        { address: underlying[0], amount: 40000n },
        { address: underlying[1], amount: 40000n },
        { address: underlying[2], amount: 40000n },
      ];
      expect(netExcessAmounts).to.deep.equal(expectedNetExcessAmounts);
    });

    it("should return an array that excludes any net amounts that are negative", () => {
      const reserveAddresses = Object.keys(RESERVE_POOLS);

      const rebalanceAmounts = [
        { address: reserveAddresses[0], amount: 10000n },
        { address: reserveAddresses[1], amount: 10000n },
        { address: reserveAddresses[2], amount: 50000n },
      ];

      const reserveValues = Object.values(RESERVE_POOLS);

      const balances = {
        [reserveValues[0].underlyer]: 50000n,
        [reserveValues[1].underlyer]: 50000n,
        [reserveValues[2].underlyer]: 10000n,
      };

      const netExcessAmounts = strategy.getUnderlyersWithNetExcess(
        rebalanceAmounts,
        balances
      );

      const underlying = Object.keys(balances);

      const expectedNetExcessAmounts = [
        { address: underlying[0], amount: 40000n },
        { address: underlying[1], amount: 40000n },
      ];
      expect(netExcessAmounts).to.deep.equal(expectedNetExcessAmounts);
    });

    it("should throw an error if a rebalance amount uses an unconfigured reserve pool", () => {
      const reserveAddresses = Object.keys(RESERVE_POOLS);

      const rebalanceAmounts = [
        { address: reserveAddresses[0], amount: 10000n },
        { address: reserveAddresses[1], amount: 10000n },
        { address: ethers.constants.AddressZero, amount: 10000n },
      ];

      const reserveValues = Object.values(RESERVE_POOLS);

      const balances = {
        [reserveValues[0].underlyer]: 50000n,
        [reserveValues[1].underlyer]: 50000n,
        [reserveValues[2].underlyer]: 50000n,
      };

      expect(() =>
        strategy.getUnderlyersWithNetExcess(rebalanceAmounts, balances)
      ).to.throw(TypeError);
    });

    it("should throw an error if a rebalance amount's underlyer does not have a corresponding balance", () => {
      const reserveAddresses = Object.keys(RESERVE_POOLS);

      const rebalanceAmounts = [
        { address: reserveAddresses[0], amount: 10000n },
        { address: reserveAddresses[1], amount: 10000n },
        { address: reserveAddresses[2], amount: 10000n },
      ];

      const reserveValues = Object.values(RESERVE_POOLS);

      const balances = {
        [reserveValues[0].underlyer]: 50000n,
        [reserveValues[1].underlyer]: 50000n,
      };

      expect(() =>
        strategy.getUnderlyersWithNetExcess(rebalanceAmounts, balances)
      ).to.throw(TypeError);
    });
  });

  describe("getLargestAmount", () => {
    it("should return the largest token amount in the array", async () => {
      const reserveValues = Object.values(RESERVE_POOLS);
      const amounts = [
        { address: reserveValues[0].underlyer, amount: 10000n },
        { address: reserveValues[1].underlyer, amount: 50000n },
        { address: reserveValues[2].underlyer, amount: 40000n },
      ];

      const largestAmount = strategy.getLargestAmount(amounts);

      const expectedLargestAmount = {
        address: reserveValues[1].underlyer,
        amount: 50000n,
      };

      expect(largestAmount).to.deep.equal(expectedLargestAmount);
    });

    it("should return the first amount if multiple amounts have the same largest amount value", async () => {
      const reserveValues = Object.values(RESERVE_POOLS);
      const amounts = [
        { address: reserveValues[0].underlyer, amount: 10000n },
        { address: reserveValues[1].underlyer, amount: 50000n },
        { address: reserveValues[2].underlyer, amount: 50000n },
      ];

      const largestAmount = strategy.getLargestAmount(amounts);

      const expectedLargestAmount = {
        address: reserveValues[1].underlyer,
        amount: 50000n,
      };

      expect(largestAmount).to.deep.equal(expectedLargestAmount);
    });

    it("should throw an error if the array of amounts is empty", async () => {
      const reserveValues = Object.values(RESERVE_POOLS);
      const amounts = [];
      expect(() => strategy.getLargestAmount(amounts)).to.throw(RangeError);
    });
  });

  describe("getLargestNetExcess", () => {
    it("should return the token amount with the largest net excess", async () => {
      const reserveAddresses = Object.keys(RESERVE_POOLS);

      const rebalanceAmounts = [
        { address: reserveAddresses[0], amount: 100n * 10n ** 18n },
        { address: reserveAddresses[1], amount: 100n * 10n ** 6n },
        { address: reserveAddresses[2], amount: 100n * 10n ** 6n },
      ];

      const balances = {
        [DAI_ADDRESS]: 50n * 10n ** 18n,
        [USDC_ADDRESS]: 500n * 10n ** 6n,
        [USDT_ADDRESS]: -100n * 10n ** 6n,
      };

      const largestNetExcess = await strategy.getLargestNetExcess(
        rebalanceAmounts,
        balances
      );

      const expectedLargestNetExcess = {
        address: USDC_ADDRESS,
        amount: 400n * 10n ** 18n,
      };
      expect(largestNetExcess).to.deep.equal(expectedLargestNetExcess);
    });
  });

  describe("getNextBalanceAmount", () => {
    it("should throw an Error if there are no reserves and balances in net excess", async () => {
      const reserveAddresses = Object.keys(RESERVE_POOLS);

      const rebalanceAmounts = [
        { address: reserveAddresses[0], amount: 500n * 10n ** 18n },
        { address: reserveAddresses[1], amount: 500n * 10n ** 6n },
        { address: reserveAddresses[2], amount: 500n * 10n ** 6n },
      ];
      sinon.replace(strategy.mapt, "getRebalanceAmounts", () =>
        Promise.resolve(rebalanceAmounts)
      );

      const balances = {
        [DAI_ADDRESS]: 100n * 10n ** 18n,
        [USDC_ADDRESS]: 100n * 10n ** 6n,
        [USDT_ADDRESS]: 100n * 10n ** 6n,
      };
      sinon.replace(strategy.lpAccount, "getUnderlyerBalances", () =>
        Promise.resolve(balances)
      );

      await expect(strategy.getNextBalanceAmount()).to.be.rejectedWith(Error);
    });

    it("should return the amount that can be added to an index position from the token that has the largest reserves in excess", async () => {
      const reserveAddresses = Object.keys(RESERVE_POOLS);

      const rebalanceAmounts = [
        { address: reserveAddresses[0], amount: 100n * 10n ** 18n },
        { address: reserveAddresses[1], amount: 100n * 10n ** 6n },
        { address: reserveAddresses[2], amount: 100n * 10n ** 6n },
      ];
      sinon.replace(strategy.mapt, "getRebalanceAmounts", () =>
        Promise.resolve(rebalanceAmounts)
      );

      const balances = {
        [DAI_ADDRESS]: 50n * 10n ** 18n,
        [USDC_ADDRESS]: 500n * 10n ** 6n,
        [USDT_ADDRESS]: -100n * 10n ** 6n,
      };
      sinon.replace(strategy.lpAccount, "getUnderlyerBalances", () =>
        Promise.resolve(balances)
      );

      const nextBalanceAmount = await strategy.getNextBalanceAmount();

      const expectedNextBalanceAmount = {
        address: USDC_ADDRESS,
        amount: 500n * 10n ** 6n,
      };
      expect(nextBalanceAmount).to.deep.equal(expectedNextBalanceAmount);
    });
  });
});
