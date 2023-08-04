import { SupportedToken, tokenSymbolByAddress } from "@gearbox-protocol/sdk";

type UnusedTokens =
  | Extract<
      SupportedToken,
      "1INCH" | "AAVE" | "COMP" | "DPI" | "FEI" | "LINK" | "UNI" | "YFI"
    >
  | "deploy me";

const UNUSED_TOKENS: Record<UnusedTokens, true> = {
  "1INCH": true,
  AAVE: true,
  COMP: true,
  DPI: true,
  FEI: true,
  LINK: true,
  UNI: true,
  YFI: true,
  "deploy me": true,
};

type TokensWithoutChainlinkPrice = Extract<
  SupportedToken,
  | "dDAI"
  | "dUSDC"
  | "dWBTC"
  | "dWETH"
  | "dwstETH"
  | "dFRAX"
  | UnusedTokens
  | "GEAR"
  | "OHM"
  | "OHMFRAXBP"
  | "cvxOHMFRAXBP"
  | "50OHM_50DAI"
  | "50OHM_50WETH"
  | "OHM_wstETH"
  | "crvCRVETH"
  | "crvCVXETH"
  | "crvUSDTWBTCWETH"
  | "LDOETH"
  | "MIM_3LP3CRV"
  | "cvxMIM_3LP3CRV"
  | "cvxcrvCRVETH"
  | "cvxcrvCVXETH"
  | "cvxcrvUSDTWBTCWETH"
  | "cvxLDOETH"
  | "stkcvxMIM_3LP3CRV"
  | "stkcvxcrvCRVETH"
  | "stkcvxcrvCVXETH"
  | "stkcvxcrvUSDTWBTCWETH"
  | "stkcvxLDOETH"
  | "stkcvxOHMFRAXBP"
  | "SPELL"
  | "MIM"
>;

const TOKENS_WITHOUT_CHAINLINK_PRICE: Record<
  TokensWithoutChainlinkPrice,
  true
> = {
  ...UNUSED_TOKENS,
  dDAI: true,
  dUSDC: true,
  dWBTC: true,
  dWETH: true,
  dwstETH: true,
  dFRAX: true,
  GEAR: true,

  OHM: true,
  OHMFRAXBP: true,
  cvxOHMFRAXBP: true,
  "50OHM_50DAI": true,
  "50OHM_50WETH": true,
  OHM_wstETH: true,

  crvCRVETH: true,
  crvCVXETH: true,
  crvUSDTWBTCWETH: true,
  LDOETH: true,
  MIM_3LP3CRV: true,
  cvxMIM_3LP3CRV: true,
  cvxcrvCRVETH: true,
  cvxcrvCVXETH: true,
  cvxcrvUSDTWBTCWETH: true,
  cvxLDOETH: true,
  stkcvxMIM_3LP3CRV: true,
  stkcvxcrvCRVETH: true,
  stkcvxcrvCVXETH: true,
  stkcvxcrvUSDTWBTCWETH: true,
  stkcvxLDOETH: true,

  stkcvxOHMFRAXBP: true,
  SPELL: true,
  MIM: true,
};

const isTokenWithoutChainlinkPrice = (
  t: unknown,
): t is TokensWithoutChainlinkPrice =>
  typeof t === "string" &&
  !!TOKENS_WITHOUT_CHAINLINK_PRICE[t as TokensWithoutChainlinkPrice];

type TokensWithChainlinkPrice = Exclude<
  SupportedToken,
  TokensWithoutChainlinkPrice
>;

export type ChainlinkPriceTokensList = Array<TokensWithChainlinkPrice>;

export const CHAINLINK_PRICE_TOKENS = Array.from(
  new Set(
    Object.entries(tokenSymbolByAddress)
      .filter(
        ([address, key]) =>
          !isTokenWithoutChainlinkPrice(key) &&
          !isTokenWithoutChainlinkPrice(address.toLowerCase()),
      )
      .map(([, key]) => key),
  ),
) as ChainlinkPriceTokensList;
