const axios = require('axios'); // axios to get api calls

// Currency API and the access key given here is mine, you can use this upto 1000 calls per month.
const CURRENCY_API = `http://data.fixer.io/api/latest?access_key=7cb0586f6e76d780ffe027cc60afbee1`;

// Country API
const COUNTRY_API = `https://restcountries.com/v2/currency/`;

// Fetching currency Data
const getExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    // Destructure only the rates from the Currency API
    const {
      data: { rates },
    } = await axios.get(CURRENCY_API); // await call to get async data

    const rup = 1 / rates[fromCurrency];
    const exchangeRate = rup * rates[toCurrency];

    return exchangeRate;
  } catch (error) {
    throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}`);
  }
};

// Fetching country Data
const getCountries = async (currencyCode) => {
  try {
    // Destructure only the Country Data from Country API
    const { data } = await axios.get(`${COUNTRY_API}/${currencyCode}`);
    return data.map(({ name }) => name); // Destructure only the name of the Country
  } catch (error) {
    throw new Error(`Unable to get countries that use ${currencyCode}`);
  }
};

// Convert the Currency
const convertCurrency = async (fromCurrency, toCurrency, amount) => {
  fromCurrency = fromCurrency.toUpperCase();
  toCurrency = toCurrency.toUpperCase();
  // 0 s

  const [exchangeRate, countries] = await Promise.all([
    getExchangeRate(fromCurrency, toCurrency), // 1 s
    getCountries(toCurrency), // 1 s
  ]); // 2s
  // Instead of getting individual calls, we saved 2 seconds.
  // 2 s

  const convertedAmount = (amount * exchangeRate).toFixed(2);
  return (`💸💸 ${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. \n🌍🌍 You can spend ${toCurrency} in the following Countries: ${ countries }.`);
}

convertCurrency("USD", "INR", 10)
  .then((result) => console.log(result))
  .catch((error) => console.log(error));
