import { useEffect, useState } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)

  const apiKey = import.meta.env.VITE_OPENWEATHER_KEY

  useEffect(() => {
    if (!apiKey) {
      return
    }

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(capital)}&appid=${apiKey}&units=metric`
      )
      .then((response) => setWeather(response.data))
      .catch(() => setError('weather is not available'))
  }, [capital, apiKey])

  if (!apiKey) {
    return (
      <p>
        Add VITE_OPENWEATHER_KEY to a .env.local file to see the weather for{' '}
        {capital}
      </p>
    )
  }

  if (error) {
    return <p>{error}</p>
  }

  if (!weather) {
    return null
  }

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>temperature {weather.main.temp} Celsius</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const Country = ({ country }) => {
  const capital = country.capital ? country.capital[0] : country.name.common

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {capital}</p>
      <p>area {country.area}</p>
      <h3>languages</h3>
      <ul>
        {Object.values(country.languages || {}).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img
        src={country.flags.png}
        alt={`flag of ${country.name.common}`}
        width="160"
      />
      <Weather capital={capital} />
    </div>
  )
}

export default Country
