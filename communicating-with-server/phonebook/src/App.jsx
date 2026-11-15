import { useEffect, useState } from 'react'
import personsService from './services/persons'
import Notification from './components/Notification'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personsService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])

  const notify = (text, kind = 'success') => {
    setMessage({ text, kind })
    setTimeout(() => setMessage(null), 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existing = persons.find((person) => person.name === newName)
    if (existing) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personsService
          .update(existing.id, { ...existing, number: newNumber })
          .then((updated) => {
            setPersons(
              persons.map((person) => (person.id !== updated.id ? person : updated))
            )
            notify(`Updated ${updated.name}`)
          })
          .catch(() => {
            notify(
              `Information of ${existing.name} has already been removed from server`,
              'error'
            )
            setPersons(persons.filter((person) => person.id !== existing.id))
          })
      }
      setNewName('')
      setNewNumber('')
      return
    }

    personsService
      .create({ name: newName, number: newNumber })
      .then((created) => {
        setPersons(persons.concat(created))
        notify(`Added ${created.name}`)
        setNewName('')
        setNewNumber('')
      })
      .catch(() => {
        notify('Failed to add the person', 'error')
      })
  }

  const removePerson = (person) => {
    if (!window.confirm(`Delete ${person.name} ?`)) {
      return
    }

    personsService.remove(person.id).then(() => {
      setPersons(persons.filter((p) => p.id !== person.id))
      notify(`Deleted ${person.name}`)
    })
  }

  const personsToShow =
    filter.length === 0
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter filter={filter} setFilter={setFilter} />

      <h3>add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
      />

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} removePerson={removePerson} />
    </div>
  )
}

export default App
