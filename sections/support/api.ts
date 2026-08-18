import axios from "axios";
import BigNumber from "bignumber.js";

export async function getBinancePriceData(
  symbol: any,
  period: any,
  limit: any,
) {
  symbol = symbol.toUpperCase();
  const url = `https://api.binance.com/api/v1/klines?symbol=${symbol}&interval=${period}&limit=${limit}`;
  const response = await axios.get(url);
  const data = response.data;
  return data.map((item: any) => parseFloat(item[4])); // Kapanış fiyatlarını alıyoruz
}

export function findSupportResistanceLevels(
  priceSeries: number[],
  window: number,
) {
  const strongSupport: BigNumber[] = [];
  const weakSupport: BigNumber[] = [];
  const strongResistance: BigNumber[] = [];
  const weakResistance: BigNumber[] = [];

  for (let i = window; i < priceSeries.length; i++) {
    const windowPrices = priceSeries.slice(i - window, i);
    const minPrice = new BigNumber(Math.min(...windowPrices));
    const maxPrice = new BigNumber(Math.max(...windowPrices));
    const currentPrice = new BigNumber(priceSeries[i]);

    // Window içindeki min ve max fiyatlar arasındaki fark kontrol edilir
    const priceRange = maxPrice.minus(minPrice);

    if (
      currentPrice.isLessThanOrEqualTo(minPrice.plus(priceRange.times(0.05)))
    ) {
      const supportCount = windowPrices.filter((price) =>
        new BigNumber(price)
          .minus(minPrice)
          .abs()
          .isLessThanOrEqualTo(priceRange.times(0.05)),
      ).length;
      if (supportCount >= window / 2) {
        // Strong support
        if (!strongSupport.find((s) => s.isEqualTo(minPrice))) {
          strongSupport.push(minPrice);
        }
      } else {
        // Weak support
        if (!weakSupport.find((s) => s.isEqualTo(minPrice))) {
          weakSupport.push(minPrice);
        }
      }
    } else if (
      currentPrice.isGreaterThanOrEqualTo(
        maxPrice.minus(priceRange.times(0.05)),
      )
    ) {
      const resistanceCount = windowPrices.filter((price) =>
        maxPrice
          .minus(new BigNumber(price))
          .abs()
          .isLessThanOrEqualTo(priceRange.times(0.05)),
      ).length;
      if (resistanceCount >= window / 2) {
        // Strong resistance
        if (!strongResistance.find((r) => r.isEqualTo(maxPrice))) {
          strongResistance.push(maxPrice);
        }
      } else {
        // Weak resistance
        if (!weakResistance.find((r) => r.isEqualTo(maxPrice))) {
          weakResistance.push(maxPrice);
        }
      }
    }
  }

  // Destek ve direnç seviyelerini sıralama
  strongSupport.sort((a, b) => a.minus(b).toNumber());
  weakSupport.sort((a, b) => a.minus(b).toNumber());
  strongResistance.sort((a, b) => b.minus(a).toNumber());
  weakResistance.sort((a, b) => b.minus(a).toNumber());

  return { strongSupport, weakSupport, strongResistance, weakResistance };
}
