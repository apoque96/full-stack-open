const Person = ({ person, onClick }) => {
  return (
    <div>
      {person.name} {person.number}
      <button type="button" onClick={() => onClick(person)}>
        delete
      </button>
    </div>
  );
};

export default Person;
