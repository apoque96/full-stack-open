const mongoose = require("mongoose");

const argumentsLength = process.argv.length;

if (argumentsLength < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://apoque003:${password}@phonebook.wwb1hdx.mongodb.net/?retryWrites=true&w=majority&appName=phonebook`;
mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (argumentsLength === 3) {
  console.log("phonebook:");
  Person.find({}).then((res) => {
    res.forEach((person) => console.log(person));
    mongoose.connection.close();
  });
} else if (argumentsLength === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name,
    number,
  });

  person.save().then((res) => {
    console.log(`added ${res.name} ${res.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log("Incorrect arguments: expected 'Password', 'Name', 'Number'");
  mongoose.connection.close();
}
