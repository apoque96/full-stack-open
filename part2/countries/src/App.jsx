import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Country from "./components/Country";
import CountriesList from "./components/CountriesList";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((res) => setCountries(res.data));
  }, []);

  if (countries.length === 0) return <div></div>;

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <div>
        find countries{" "}
        <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>
      {filter === "" ? (
        <p>Type a countrie to start</p>
      ) : filteredCountries.length > 10 ? (
        <p>Too many matches: specify another filter</p>
      ) : filteredCountries.length > 1 ? (
        <CountriesList countries={filteredCountries} />
      ) : filteredCountries.length === 1 ? (
        <Country country={filteredCountries[0]} />
      ) : (
        <p>No matching countries</p>
      )}
    </div>
  );
};

export default App;
