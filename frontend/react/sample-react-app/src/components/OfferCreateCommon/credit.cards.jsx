import Cards from "react-credit-cards-2";

export const CreditCards = ({ values, focusedInput }) => {
  const getFocusedInputName = (focusedInput) => {
    if (focusedInput === "CardOwner") return "name";
    if (focusedInput === "CardNumber") return "number";
    if (focusedInput === "ExpiryDate") return "expiry";
    if (focusedInput === "CVV") return "cvc";
  };
  return (
    <div className="credit__cards h-full flex items-center">
      <Cards
        number={values?.CardNumber}
        cvc={values?.CVV}
        expiry={values?.ExpiryDate}
        name={values?.CardOwner}
        placeholders={{ name: "ADI SOYADI" }}
        focused={getFocusedInputName(focusedInput)}
        acceptedCards={["visa", "mastercard"]}
      />
    </div>
  );
};
