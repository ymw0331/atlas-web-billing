// ============================================
// Enum Types
// ============================================

export type BillingPeriod = "Monthly" | "Quarterly";

export type BillingType = "ClearingFeeBilling" | "Incentive" | "CashSettlementFee";

export type PayoutType = "SUM" | "MAX" | "TIERED_SUM";

export type PayoutUnit = "USD per Lot" | "SGD per Lot" | "Percent" | "BasisPoint";

export type ContractMonth = "SpotMonth" | "SecondNearestContractMonth";

export type RollType = "LTD";

export type ObligationType = "Volume" | "ADOI" | "MQTV" | "Percentage";

export type ValueType = "Range" | "GreaterThan";

export type ValueUnit = "Lots" | "Tones" | "Metric Tonnes";

export type ObligationGroupType = "AND" | "OR";

export type TierValueUnit = "IndexPts";

// ============================================
// Nested Types for ProductFilter
// ============================================

export interface TradeCategory {
  electronic: boolean;
  nlt: boolean;
  maker: boolean;
  taker: boolean;
}

export interface ContractFilter {
  contractCategory?: string;
  contractMonth?: ContractMonth;
  outrightTrade?: boolean;
  calendarSpreadTrade?: boolean;
}

export interface RollsFilter {
  rollType?: RollType;
  rollOutStart?: number;
  rollInStart?: number;
}

export interface ProductFilter {
  filterName: string;
  assetClass: string;
  productCodes: string[];
  tradeCategory: TradeCategory;
  contractFilter?: ContractFilter;
  rollsFilter?: RollsFilter;
}

// ============================================
// Nested Types for Incentive/Obligations
// ============================================

export interface TimeRange {
  startTime: string;
  endTime: string;
}

export interface MarketMakerObligationTier {
  spread: number;
  valueType: ValueType;
  valueFrom: number;
  valueTo: number;
  valueUnit: TierValueUnit;
}

export interface MarketMakerObligation {
  applicableProductGroupNames?: string[];
  timeRange: TimeRange;
  endTimeInNextDay: boolean;
  minQuoteTimePercentage: number;
  minSizeInLotsOnEachSide: number;
  obligationTiers?: MarketMakerObligationTier[];
}

export interface Obligation {
  applicableProductGroupNames?: string[];
  obligationType: ObligationType;
  valueType: ValueType;
  valueFrom: number;
  valueTo: number;
  valueUnit: ValueUnit;
}

export interface ObligationGroup {
  type: ObligationGroupType;
  groups?: ObligationGroup[];
  obligations?: Obligation[];
  marketMakerObligations?: MarketMakerObligation[];
}

export interface Incentive {
  applicableProductGroupNames?: string[];
  payoutUnit: PayoutUnit;
  payoutRate: number;
  obligations: ObligationGroup;
}

// ============================================
// Main Form Data Interface
// ============================================

export interface SchemeFormData {
  name: string;
  description?: string;
  isMarketMakerScheme: boolean;
  billingPeriod: BillingPeriod;
  billingType?: BillingType;
  payoutCap?: number;
  payoutType?: PayoutType;
  expiresAt?: Date | null;
  billingProducts: ProductFilter[];
  supportProducts: ProductFilter[];
  incentives: Incentive[];
}

// ============================================
// Default Values
// ============================================

export const defaultTradeCategory: TradeCategory = {
  electronic: false,
  nlt: false,
  maker: false,
  taker: false,
};

export const defaultProductFilter: ProductFilter = {
  filterName: "",
  assetClass: "",
  productCodes: [],
  tradeCategory: { ...defaultTradeCategory },
  contractFilter: undefined,
  rollsFilter: undefined,
};

export const defaultObligation: Obligation = {
  obligationType: "Volume",
  valueType: "Range",
  valueFrom: 0,
  valueTo: 0,
  valueUnit: "Lots",
};

export const defaultMarketMakerObligation: MarketMakerObligation = {
  timeRange: { startTime: "09:00", endTime: "17:00" },
  endTimeInNextDay: false,
  minQuoteTimePercentage: 0,
  minSizeInLotsOnEachSide: 0,
  obligationTiers: [],
};

export const defaultObligationGroup: ObligationGroup = {
  type: "AND",
  groups: [],
  obligations: [],
  marketMakerObligations: [],
};

export const defaultIncentive: Incentive = {
  payoutUnit: "USD per Lot",
  payoutRate: 0,
  obligations: { ...defaultObligationGroup },
};

export const defaultSchemeFormValues: SchemeFormData = {
  name: "",
  description: "",
  isMarketMakerScheme: false,
  billingPeriod: "Monthly",
  billingType: undefined,
  payoutCap: undefined,
  payoutType: undefined,
  expiresAt: null,
  billingProducts: [],
  supportProducts: [],
  incentives: [],
};

// ============================================
// Select Options
// ============================================

export const billingPeriodOptions: { value: BillingPeriod; label: string }[] = [
  { value: "Monthly", label: "Monthly" },
  { value: "Quarterly", label: "Quarterly" },
];

export const billingTypeOptions: { value: BillingType; label: string }[] = [
  { value: "ClearingFeeBilling", label: "Clearing Fee Billing" },
  { value: "Incentive", label: "Incentive" },
  { value: "CashSettlementFee", label: "Cash Settlement Fee" },
];

export const payoutTypeOptions: { value: PayoutType; label: string }[] = [
  { value: "SUM", label: "Sum" },
  { value: "MAX", label: "Maximum" },
  { value: "TIERED_SUM", label: "Tiered Sum" },
];

export const payoutUnitOptions: { value: PayoutUnit; label: string }[] = [
  { value: "USD per Lot", label: "USD per Lot" },
  { value: "SGD per Lot", label: "SGD per Lot" },
  { value: "Percent", label: "Percent" },
  { value: "BasisPoint", label: "Basis Point" },
];

export const contractMonthOptions: { value: ContractMonth; label: string }[] = [
  { value: "SpotMonth", label: "Spot Month" },
  { value: "SecondNearestContractMonth", label: "Second Nearest Contract Month" },
];

export const obligationTypeOptions: { value: ObligationType; label: string }[] = [
  { value: "Volume", label: "Volume" },
  { value: "ADOI", label: "ADOI (Avg Daily Open Interest)" },
  { value: "MQTV", label: "MQTV (Monthly Qualifying Traded Value)" },
  { value: "Percentage", label: "Percentage" },
];

export const valueTypeOptions: { value: ValueType; label: string }[] = [
  { value: "Range", label: "Range" },
  { value: "GreaterThan", label: "Greater Than" },
];

export const valueUnitOptions: { value: ValueUnit; label: string }[] = [
  { value: "Lots", label: "Lots" },
  { value: "Tones", label: "Tones" },
  { value: "Metric Tonnes", label: "Metric Tonnes" },
];

export const obligationGroupTypeOptions: { value: ObligationGroupType; label: string }[] = [
  { value: "AND", label: "AND" },
  { value: "OR", label: "OR" },
];

// ============================================
// Mock Data for Autocomplete
// ============================================

export const assetClassOptions = [
  "Equities",
  "Fixed Income",
  "Commodities",
  "FX",
  "Derivatives",
];

export const contractCategoryOptions = [
  "Futures",
  "Options",
  "Swaps",
  "Forwards",
];

export const productCodeOptions = [
  "ATLAS-NK",
  "ATLAS-TW",
  "ATLAS-IN",
  "ATLAS-CN",
  "ATLAS-FTSE",
  "ATLAS-MSCI",
  "ATLAS-SGD",
  "ATLAS-USD",
  "ATLAS-JPY",
  "ATLAS-EUR",
  "IO",
  "FEF",
  "TC",
  "RBD",
];
