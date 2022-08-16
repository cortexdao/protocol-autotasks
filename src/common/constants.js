const { toBigInt } = require("./utils");

// Global constants
exports.USD_DECIMALS = 8n;
exports.COINGECKO_PRICE_DECIMALS = 18n;

// Safes
exports.LP_SAFE_ADDRESS = "0x5b79121EA6dC2395B8046eCDCE14D66c2bF221B0";

// Protocol contracts
exports.LP_ACCOUNT_ADDRESS = "0xE08Ee4C1b248464aAcC5c0130247b1B9d9e6005E";
exports.META_POOL_TOKEN_ADDRESS = "0x991A7e6192EF6A4FBac81C1ADF2Ea1231B8Ea4A4";
exports.TVL_MANAGER_ADDRESS = "0x74A07A137E347590B7d6FA63B70C2C331aF94a8B";

// Reward tokens
exports.CRV_ADDRESS = "0xD533a949740bb3306d119CC777fa900bA034cd52";
exports.CVX_ADDRESS = "0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B";
exports.SNX_ADDRESS = "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F";

// 3pool underlying
exports.DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
exports.USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
exports.USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const threePool = [
  exports.DAI_ADDRESS,
  exports.USDC_ADDRESS,
  exports.USDT_ADDRESS,
];

// Metapool underlying
exports.MUSD_ADDRESS = "0xe2f2a5C287993345a840Db3B0845fbC70f5935a5";
exports.FRAX_ADDRESS = "0x853d955aCEf822Db058eb8505911ED77F175b99e";
exports.SUSD_ADDRESS = "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51";
exports.BUSD_ADDRESS = "0x4Fabb145d64652a948d72533023f6E7A623C7C53";
exports.DOLA_ADDRESS = "0x865377367054516e17014CcdED1e7d814EDC9ce4";
exports.MIM_ADDRESS = "0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3";

// Stableswaps
exports.THREEPOOL_STABLESWAP_ADDRESS =
  "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7";
exports.MUSD_STABLESWAP_ADDRESS = "0x8474DdbE98F5aA3179B3B3F5942D724aFcdec9f6";
exports.FRAX_STABLESWAP_ADDRESS = "0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B";
exports.FRAXUSDC_STABLESWAP_ADDRESS =
  "0xDcEF968d416a41Cdac0ED8702fAC8128A64241A2";
exports.SUSD_STABLESWAP_ADDRESS = "0xA5407eAE9Ba41422680e2e00537571bcC53efBfD";
exports.BUSD_V2_STABLESWAP_ADDRESS =
  "0x4807862AA8b2bF68830e4C8dc86D0e9A998e085a";
exports.DOLA_STABLESWAP_ADDRESS = "0xAA5A67c256e27A5d80712c51971408db3370927D";
exports.MIM_STABLESWAP_ADDRESS = "0x5a6A4D54456819380173272A5E8E9B9904BdF41B";
exports.IB_STABLESWAP_ADDRESS = "0x2dded6Da1BF5DBdF597C45fcFaa3194e53EcfeAF";

exports.DEPEG_THRESHOLDS = {
  [exports.DAI_ADDRESS]: 0.9,
  [exports.USDC_ADDRESS]: 0.9,
  [exports.USDT_ADDRESS]: 0.9,
  [exports.MUSD_ADDRESS]: 0.9,
  [exports.FRAX_ADDRESS]: 0.9,
  [exports.SUSD_ADDRESS]: 0.9,
  [exports.BUSD_ADDRESS]: 0.9,
  [exports.DOLA_ADDRESS]: 0.9,
  [exports.MIM_ADDRESS]: 0.9,
};

exports.CURVE_POOLS = {
  [exports.THREEPOOL_STABLESWAP_ADDRESS]: threePool,
  [exports.MUSD_STABLESWAP_ADDRESS]: [exports.MUSD_ADDRESS, ...threePool],
  [exports.FRAX_STABLESWAP_ADDRESS]: [exports.FRAX_ADDRESS, ...threePool],
  [exports.FRAXUSDC_STABLESWAP_ADDRESS]: [
    exports.FRAX_ADDRESS,
    exports.USDC_ADDRESS,
  ],
  [exports.SUSD_STABLESWAP_ADDRESS]: [...threePool, exports.SUSD_ADDRESS],
  [exports.BUSD_V2_STABLESWAP_ADDRESS]: [exports.BUSD_ADDRESS, ...threePool],
  [exports.DOLA_STABLESWAP_ADDRESS]: [exports.DOLA_ADDRESS, ...threePool],
  [exports.MIM_STABLESWAP_ADDRESS]: [exports.MIM_ADDRESS, ...threePool],
  [exports.IB_STABLESWAP_ADDRESS]: [...threePool],
};

exports.SWAPS = {
  CRV: {
    name: "crv-to-usdc",
    address: exports.CRV_ADDRESS,
    inTokenDecimals: 18n,
    outTokenDecimals: 6n,
    slippage: "0.05",
  },
  CVX: {
    name: "cvx-to-usdc",
    address: exports.CVX_ADDRESS,
    inTokenDecimals: 18n,
    outTokenDecimals: 6n,
    slippage: "0.05",
  },
};

exports.RESERVE_POOLS = {
  "0x75CE0E501e2E6776FcAAa514f394a88a772A8970": {
    id: "0x646169506f6f6c00000000000000000000000000000000000000000000000000",
    underlyer: exports.DAI_ADDRESS,
    underlyerDecimals: 18n,
  },
  "0xe18b0365D5D09F394f84eE56ed29DD2d8D6Fba5f": {
    id: "0x75736463506f6f6c000000000000000000000000000000000000000000000000",
    underlyer: exports.USDC_ADDRESS,
    underlyerDecimals: 6n,
  },
  "0xeA9c5a2717D5Ab75afaAC340151e73a7e37d99A7": {
    id: "0x75736474506f6f6c000000000000000000000000000000000000000000000000",
    underlyer: exports.USDT_ADDRESS,
    underlyerDecimals: 6n,
  },
};

exports.RESERVE_POOL_IDS = Object.values(exports.RESERVE_POOLS).map(
  ({ id }) => id
);

// Index weights
exports.WEIGHT_DECIMALS = 8n;

exports.TARGET_WEIGHTS = [
  { name: "convex-3pool", weight: "7.33" },
  { name: "convex-frax", weight: "10.56" },
  { name: "convex-fraxusdc", weight: "10.56" },
  { name: "convex-susdv2", weight: "2.64" },
  { name: "convex-mim", weight: "10.56" },
  { name: "convex-ironbank", weight: "4.69" },
  { name: "convex-busdv2", weight: "4.69" },
  { name: "convex-dola", weight: "10.56" },
  { name: "convex-musd", weight: "4.69" },
  // Convert weight values to BigInt
].map(({ name, weight }) => {
  return { name, weight: toBigInt(weight, exports.WEIGHT_DECIMALS - 2n) };
});
