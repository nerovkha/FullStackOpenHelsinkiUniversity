import { useEffect, useState } from 'react'
import axios from 'axios'
import Countries from './components/Countries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => setCountries(response.data))
  }, [])

  const countriesToShow =
    filter.length === 0
      ? []
      : countries.filter((country) =>
          country.name.common
            .toLowerCase()
            .startsWith(filter.trim().toLowerCase())
        )

  return (
    <div>
      <p>
        find countries{' '}
        <input
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />
      </p>
      <Countries countries={countriesToShow} />
    </div>
  )
}

export default App
