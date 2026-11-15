const Persons = ({ personsToShow, removePerson }) => (
  <ul style={{ listStyle: 'none', padding: 0 }}>
    {personsToShow.map((person) => (
      <li key={person.id}>
        {person.name} {person.number}{' '}
        <button onClick={() => removePerson(person)}>delete</button>
      </li>
    ))}
  </ul>
)

export default Persons
