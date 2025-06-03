const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

test('can create a user', async () => {
  const user = {
    username: 'apoque96',
    name: 'dereck',
    password: 'SuperSecretPassword',
  }

  const savedUser = await api
    .post('/api/users')
    .send(user)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const savedUsers = await helper.usersInDb()

  assert.strictEqual(savedUsers.length, 1)
  assert.deepStrictEqual(savedUser.body, {
    username: 'apoque96',
    name: 'dereck',
    blogs: [],
    id: savedUser.body.id, // We don't really care about the id
  })
})

describe('user creation exceptions', () => {
  test('if missing username throws 400', async () => {
    const user = {
      name: 'dereck',
      password: 'SuperSecretPassword',
    }

    await api.post('/api/users').send(user).expect(400)

    const savedUsers = await helper.usersInDb()

    assert.strictEqual(savedUsers.length, 0)
  })

  test('if missing password throws 400', async () => {
    const user = {
      username: 'apoque96',
      name: 'dereck',
    }

    await api.post('/api/users').send(user).expect(400)

    const savedUsers = await helper.usersInDb()

    assert.strictEqual(savedUsers.length, 0)
  })

  test('if username is shorter than 3 characters throws 400', async () => {
    const user = {
      username: 'a',
      name: 'dereck',
      password: 'SuperSecretPassword',
    }

    await api.post('/api/users').send(user).expect(400)

    const savedUsers = await helper.usersInDb()

    assert.strictEqual(savedUsers.length, 0)
  })

  test('if password is shorter than 3 characters throws 400', async () => {
    const user = {
      username: 'apoque96',
      name: 'dereck',
      password: 'a',
    }

    await api.post('/api/users').send(user).expect(400)

    const savedUsers = await helper.usersInDb()

    assert.strictEqual(savedUsers.length, 0)
  })

  test('if username is not unique throws 400', async () => {
    const user = {
      username: 'apoque96',
      name: 'dereck',
      password: 'SuperSecretPassword',
    }

    await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    let savedUsers = await helper.usersInDb()

    assert.strictEqual(savedUsers.length, 1)

    await api.post('/api/users').send(user).expect(400)

    savedUsers = await helper.usersInDb()

    assert.strictEqual(savedUsers.length, 1)
  })
})

after(() => mongoose.connection.close())
