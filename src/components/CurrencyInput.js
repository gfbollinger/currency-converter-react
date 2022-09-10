import "currency-flags/dist/currency-flags.css";
import Select from "react-select";

import { components } from "react-select";
const { Option } = components;

const OptionComponent = (props) => {
  return (
    <Option {...props}>
      <span className={`currency-flag currency-flag-${props.data.value.toLowerCase()}`} /> {props.data.label}
    </Option>
  );
};

const CurrencyInput = ({ inputId, currencies, currency, onCurrencyChange, amount, onAmountChange }) => {
  let options = [];
  currencies.map((item) => {
    return options.push({ value: item, label: item });
  });

  return (
    <div>
      <input type="number" value={amount} onChange={(e) => onAmountChange(e.target.value, inputId)} />
      <Select
        onChange={(e) => onCurrencyChange(e, inputId)}
        value={currency}
        options={options}
        components={{ Option: OptionComponent }}
        styles={{ control: (styles) => ({ ...styles, borderRadius: "20px" }) }}
      />
      {/* <select onChange={(e) => onCurrencyChange(e.target.value, inputId)} value={currency}>
        {currencies &&
          currencies.map((item) => {
            return (
              <>
                <option className="currency-flag currency-flag-usd" value={item} key={item}>
                  {item}
                </option>
              </>
            );
          })}
      </select> */}
    </div>
  );
};

export default CurrencyInput;
