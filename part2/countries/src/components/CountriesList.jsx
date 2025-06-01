import { useState } from "react";
import Country from "./Country";

const CountriesList = ({ countries }) => {
  const [showCountries, setShowCountries] = useState(
    Array(countries.length).fill(false)
  );

  const handleClick = (i) => {
    const copy = [...showCountries];
    copy[i] = !copy[i];
    setShowCountries(copy);
  };

  return (
    <div>
      {countries.map((country, i) => (
        <div key={country.name.common}>
          {country.name.common}{" "}
          <button onClick={() => handleClick(i)}>
            {showCountries[i] ? "hide" : "show"}
          </button>
          {showCountries[i] && <Country country={country} />}
        </div>
      ))}
    </div>
  );
};

export default CountriesList;
