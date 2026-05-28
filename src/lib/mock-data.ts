export type Product = {
  id: number;
  name: string;
  sku: string;
  unitsSold: number;
  grossRevenue: number;
  totalFees: number;
  cogs: number;
  netProfit: number;
  margin: number;
};

export const products: Product[] = [
  { id: 1, name: "GlowGrip Phone Case", sku: "GG-CASE-001", unitsSold: 820, grossRevenue: 16400, totalFees: 3690, cogs: 4920, netProfit: 7790, margin: 47.5 },
  { id: 2, name: "Mini Heatless Curling Set", sku: "HC-MINI-014", unitsSold: 610, grossRevenue: 12200, totalFees: 3010, cogs: 4575, netProfit: 4615, margin: 37.8 },
  { id: 3, name: "Travel Makeup Pouch", sku: "TMP-BEIGE-022", unitsSold: 430, grossRevenue: 8600, totalFees: 2195, cogs: 3440, netProfit: 2965, margin: 34.5 },
  { id: 4, name: "LED Vanity Mirror", sku: "LED-MIRROR-108", unitsSold: 260, grossRevenue: 10400, totalFees: 3320, cogs: 6240, netProfit: 840, margin: 8.1 },
  { id: 5, name: "Reusable Gel Eye Pads", sku: "EYE-GEL-055", unitsSold: 390, grossRevenue: 4680, totalFees: 1585, cogs: 3510, netProfit: -415, margin: -8.9 },
  { id: 6, name: "Budget Hair Claw 4-Pack", sku: "CLAW-4PK-031", unitsSold: 720, grossRevenue: 5900, totalFees: 2240, cogs: 4320, netProfit: -660, margin: -11.2 },
];

export const summary = {
  totalRealProfit: 8742,
  totalRevenue: 42180,
  blendedMargin: 20.7,
};
