const express = require("express");
const morgan = require("morgan");
const app = express();

morgan.token("content", (req, res) => JSON.stringify(req.body));

app.use(express.json());
app.use(morgan("tiny"));
app.use(morgan(":content"));
app.use(express.static("dist"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  return String(Math.floor(Math.random() * 10000000000));
};

app.get("/info", (_req, res) => {
  const now = new Date();

  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${now}</p>`
  );
});

app.get("/api/persons", (_req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  const person = persons.find((p) => p.id === id);

  person ? res.json(person) : res.status(404).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name) res.status(400).json({ error: "Missing person name" });
  else if (!body.number)
    res.status(400).json({ error: "Missing person number" });

  if (persons.find((p) => p.name === body.name))
    res.status(400).json({ error: "Name must be unique" });

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
