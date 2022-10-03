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
  return (
    <div className="currencyInput">
      <input placeholder="Type a number" type="number" value={amount} onChange={(e) => onAmountChange(e.target.value, inputId)} />
      <Select
        onChange={(e) => onCurrencyChange(e, inputId)}
        value={currency}
        options={currencies}
        components={{ Option: OptionComponent }}
        styles={{ control: (styles) => ({ ...styles, borderRadius: "20px" }) }}
      />
    </div>
  );
};

export default CurrencyInput;
