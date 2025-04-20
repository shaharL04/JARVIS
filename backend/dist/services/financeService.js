import axios from "axios";
class financeService {
    constructor() {
        this.convertTwoCurrencies = async (currenciesForConversionData) => {
            const base_currency = currenciesForConversionData.base_currency;
            const amount = currenciesForConversionData.amount;
            const target_currency = currenciesForConversionData.target_currency;
            const apiKey = "07e256b723f54dfaa839b426ab123f96";
            try {
                // Step 1: Get base currency to USD rate (GBP -> USD)
                const responseBaseToUSD = await axios.get(`https://openexchangerates.org/api/latest.json`, {
                    params: {
                        app_id: apiKey,
                        symbols: base_currency
                    }
                });
                console.log(responseBaseToUSD.data.rates);
                const baseToUsdRate = responseBaseToUSD.data.rates[base_currency];
                // Step 2: Get USD to target currency rate (USD -> ILS)
                const responseUsdToTarget = await axios.get(`https://openexchangerates.org/api/latest.json`, {
                    params: {
                        app_id: apiKey,
                        symbols: target_currency
                    }
                });
                console.log(responseUsdToTarget.data.rates);
                const usdToTargetRate = responseUsdToTarget.data.rates[target_currency];
                // Step 3: Calculate the final conversion rate (GBP -> ILS)
                const conversionRate = (usdToTargetRate / baseToUsdRate) * amount;
                console.log("this is the conversion rate: " + conversionRate);
                return conversionRate;
            }
            catch (error) {
                console.log("error retriving wheather data for your location: " + error);
            }
        };
    }
}
export default new financeService();
//# sourceMappingURL=financeService.js.map