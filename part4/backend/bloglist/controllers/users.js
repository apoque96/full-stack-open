const bcrypt = require('bcryptjs')
const User = require('../models/user')
const usersController = require('express').Router()

usersController.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (!password) return res.status(400).json({ error: 'missing password' })
  if (password.length < 3)
    return res
      .status(400)
      .json({ error: 'password must be longer than 3 characters' })

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

usersController.get('/', async (_req, res) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  })
  return res.status(200).json(users)
})

module.exports = usersController
