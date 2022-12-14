import { useEffect, useState, useRef } from "react";
import "./App.scss";
import CurrencyInput from "./components/CurrencyInput";
import DATA_SAMPLE from "./data/data_sample";
import { currenciesInfo } from "./data/currencies";
import iconConvert from "./images/icon-convert.png";

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
  const [dummyDataMode, setdummyDataMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  let currenciesDate = useRef("");

  useEffect(() => {
    fetch(
      `https://api.apilayer.com/exchangerates_data/latest?base=USD&apikey=${process.env.REACT_APP_FIXER_IO_APIKEY}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        /* console.log(result); */
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
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        /* Setting Dummy data mode to show at least old info, but making the app usable if the api key reaches a limit */
        setdummyDataMode(true);
        const fetchedCurrencies = Object.keys(DATA_SAMPLE.rates);
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
        setCurrencyRates(DATA_SAMPLE.rates);
        currenciesDate.current = DATA_SAMPLE.date;
        setIsLoading(false);
      });
  }, []);

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
    setAmountB(() => {
      return ((amountA * currencyRates[currencyA.value]) / currencyRates[currencyB.value]).toFixed(4);
    });
    setCurrencyA(currencyB);
    setCurrencyB(currencyA);
  };

  if (isLoading) {
    return (
      <div className="wrapper">
        <div className="container">
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="container">
        <header>
          <h1>
            Currency <br />
            <strong>Converter</strong>
          </h1>
          <img src={iconConvert} alt="" />
        </header>
        <CurrencyInput
          currencies={currencies}
          currency={currencyA}
          onCurrencyChange={handleCurrencyChange}
          amount={amountA}
          onAmountChange={handleAmountChange}
          inputId="a"
        />
        <span className="equalsSign">=</span>
        <CurrencyInput
          currencies={currencies}
          currency={currencyB}
          onCurrencyChange={handleCurrencyChange}
          amount={amountB}
          onAmountChange={handleAmountChange}
          inputId="b"
        />
        <button className="button-default" onClick={handleReverseCurrencies}>
          Reverse Currencies
        </button>
        {amountA && amountB && (
          <div className="convertedResult">
            <span>
              {amountA} {currencyA.label}{" "}
              <span className={`currency-flag currency-flag-${currencyA.value.toLowerCase()}`}></span>
            </span>
            <div className="smallText">equals</div>
            <div className="bigNumber">
              {amountB} {currencyB.label}{" "}
              <span className={`currency-flag currency-flag-${currencyB.value.toLowerCase()}`}></span>
            </div>
          </div>
        )}
        {dummyDataMode && (
          <p className="well">
            <strong className="warning">Warning:</strong>
            <br />
            Showing old info: The convert rates are <strong>not updated</strong>. Api key limit reached.
          </p>
        )}
        {currenciesDate.current && (
          <p className="smallText">
            <strong>Last updated:</strong> {currenciesDate.current}
          </p>
        )}

        <p className="smallText">
          <strong>Disclaimer:</strong> This is just a learning app, the creator is not responsible for what the user can
          do with the information extracted from this app.
        </p>
      </div>
    </div>
  );
}

export default App;
