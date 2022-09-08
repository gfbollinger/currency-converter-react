const CurrencyInput = ({ inputId, currencies, currency, onCurrencyChange, amount, onAmountChange, label }) => {
  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value, inputId)}
      />

      <select
        onChange={(e) => onCurrencyChange(e.target.value, inputId)}
        value={currency}
      >
        {
          currencies && currencies.map( item => {
            return (
              <option
                value={item}
                key={item}
              >
                {item}
              </option>
            )
          })
        }
      </select>
    </div>
  )
}

export default CurrencyInput