import { useEffect, useState, useRef } from "react";
import "./App.css";
import CurrencyInput from "./components/CurrencyInput";
import DATA_SAMPLE from "./data/data_sample";
import { currenciesInfo } from "./data/currencies";

var myHeaders = new Headers();
myHeaders.append("apikey", process.env.REACT_APP_FIXER_IO_APIKEY);

var requestOptions = {
  method: "GET",
  redirect: "follow",
  headers: myHeaders,
};

function App() {
  const [currencyA, setCurrencyA] = useState({ label: "USD (US Dollar)", value: "USD" });
  const [currencyB, setCurrencyB] = useState({ label: "EUR (Euro)", value: "EUR" });
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [currencyRates, setCurrencyRates] = useState([]);

  let currenciesDate = useRef("");

  useEffect(() => {
    fetch(`https://api.apilayer.com/exchangerates_data/latest?base=USD&apikey=${process.env.REACT_APP_FIXER_IO_APIKEY}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        const fetchedCurrencies = Object.keys(result.rates);
        const newCurrencies = [];
        fetchedCurrencies.map((currencyItem) => {
          let currencyName = currenciesInfo.find((itemInfo) => {
            return itemInfo.AlphabeticCode === currencyItem;
          });
          return newCurrencies.push({
            label: currencyName && currencyName.Currency ? `${currencyItem} (${currencyName.Currency})` : "",
            value: currencyItem,
          });
        });
        setCurrencies(newCurrencies);
        setCurrencyRates(result.rates);
        currenciesDate.current = result.date;
      })
      .catch((error) => console.log("error", error));
  }, []);

  /* useEffect(() => {
    if (!currencyRates) {
      function init() {
        handleAmountChange(1, "a");
      }
      init();
    }
  }, [currencyRates]); */

  const handleAmountChange = (amount, id) => {
    console.log(amount, id);
    if (id === "a") {
      setAmountB(((amount * currencyRates[currencyB.value]) / currencyRates[currencyA.value]).toFixed(4));
      setAmountA(amount);
    }
    if (id === "b") {
      setAmountA(((amount * currencyRates[currencyA.value]) / currencyRates[currencyB.value]).toFixed(4));
      setAmountB(amount);
    }
  };

  const handleCurrencyChange = (currency, id) => {
    console.log(currency, id);
    if (id === "a") {
      setAmountB(((amountA * currencyRates[currencyB.value]) / currencyRates[currency.value]).toFixed(4));
      setCurrencyA(currency);
    }
    if (id === "b") {
      setAmountB(((amountA * currencyRates[currency.value]) / currencyRates[currencyA.value]).toFixed(4));
      setCurrencyB(currency);
    }
  };

  const handleReverseCurrencies = () => {
    setCurrencyA(currencyB);
    setCurrencyB(currencyA);
    setAmountB(() => {
      return ((amountA * currencyRates[currencyB.value]) / currencyRates[currencyA.value]).toFixed(4);
    });
  };

  return (
    <div>
      <CurrencyInput
        currencies={currencies}
        currency={currencyA}
        onCurrencyChange={handleCurrencyChange}
        amount={amountA}
        onAmountChange={handleAmountChange}
        inputId="a"
      />
      =
      <CurrencyInput
        currencies={currencies}
        currency={currencyB}
        onCurrencyChange={handleCurrencyChange}
        amount={amountB}
        onAmountChange={handleAmountChange}
        inputId="b"
      />
      <button onClick={handleReverseCurrencies}>Reverse Currencies</button>
      {currenciesDate.current && <p>Last updated: {currenciesDate.current}</p>}
    </div>
  );
}

export default App;
