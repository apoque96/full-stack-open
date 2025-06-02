import { useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notifications";
import { useEffect } from "react";
import personsService from "./services/personsService";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [number, setNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [isSuccessfull, setIsSuccessfull] = useState(true);

  useEffect(() => {
    personsService.getAll().then((allPersons) => setPersons(allPersons));
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Checks if the person is already added
    const index = persons.findIndex((person) => person.name === newName);
    const newPerson = { name: newName, number: number };

    // If the index is not -1, then that means that the person is already added
    if (index !== -1) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, ` +
            "replace the old number with a new one?"
        )
      ) {
        // Keeps a reference to the person
        const person = persons[index];

        personsService
          .update(person.id, newPerson)
          .then((updatedPerson) => {
            setPersons(
              persons.map((per) => (per.id === person.id ? updatedPerson : per))
            );
            setNewName("");
            setNumber("");

            setNotificationMessage(
              `Changed the number of ${updatedPerson.name} to ${updatedPerson.number}`
            );
            setIsSuccessfull(true);
            setTimeout(() => setNotificationMessage(null), 5000);
          })
          .catch((err) => {
            setPersons(persons.filter((per) => per.id !== person.id));
            setNotificationMessage(`Error: ${err.response.data.error}`);
            setIsSuccessfull(false);
            setTimeout(() => setNotificationMessage(null), 5000);
          });
      }
      return;
    }

    personsService
      .create(newPerson)
      .then((createdPerson) => {
        setPersons([...persons, createdPerson]);
        setNewName("");
        setNumber("");

        setNotificationMessage(`Added ${createdPerson.name}`);
        setIsSuccessfull(true);
        setTimeout(() => setNotificationMessage(null), 5000);
      })
      .catch((err) => {
        setNotificationMessage(`Error: ${err.response.data.error}`);
        setIsSuccessfull(false);
        setTimeout(() => setNotificationMessage(null), 5000);
      });
  };

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter((per) => per.id !== person.id));
          setNotificationMessage(`Deleted ${person.name}`);
          setIsSuccessfull(true);
          setTimeout(() => setNotificationMessage(null), 5000);
        })
        .catch(() => {
          setPersons(persons.filter((per) => per.id !== person.id));
          setNotificationMessage(
            `${person.name} was already deleted from the server`
          );
          setIsSuccessfull(false);
          setTimeout(() => setNotificationMessage(null), 5000);
        });
    }
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification
        message={notificationMessage}
        isSuccessfull={isSuccessfull}
      />

      <Filter filter={filter} onChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        newName={newName}
        onNameChange={handleNameChange}
        number={number}
        onNumberChange={handleNumberChange}
        onSubmit={handleSubmit}
      />

      <h3>Numbers</h3>

      <Persons persons={filteredPersons} onClick={handleDelete} />
    </div>
  );
};

export default App;
