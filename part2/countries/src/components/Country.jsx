import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Weather from "./Weather";

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?units=metric" +
          `&q=${country.name.common},${country.capital[0]}&APPID=${
            import.meta.env.VITE_SOME_KEY
          }`
      )
      .then((res) => setWeather(res.data));
  }, [country]);

  return (
    <div>
      <h2>{country.name.common}</h2>

      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>

      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img src={country.flags.png} alt={country.flags.alt} />

      <h2>Weather in {country.capital[0]}</h2>
      {weather && <Weather weather={weather} />}
    </div>
  );
};

export default Country;
