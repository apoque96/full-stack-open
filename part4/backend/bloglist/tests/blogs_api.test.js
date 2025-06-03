const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('can make request to the blogs api', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('fetches all blogs', async () => {
    const res = await api.get('/api/blogs')

    assert.strictEqual(res.body.length, helper.initialBlogs.length)
  })

  test('blogs have the property "id"', async () => {
    const res = await api.get('/api/blogs')

    res.body.forEach((blog) => assert(blog['id']))
  })

  test('can update a blog', async () => {
    const blogToUpdate = {
      title: 'test',
      author: 'test',
      url: 'http://test.com',
      likes: 20,
      id: '5a422b3a1b54a676234d17f9',
    }

    await api
      .put('/api/blogs/5a422b3a1b54a676234d17f9')
      .send(blogToUpdate)
      .expect(200)

    const savedBlogs = await helper.blogsInDb()

    const specificBlog = savedBlogs.find(
      (blog) => blog.id === '5a422b3a1b54a676234d17f9'
    )

    assert(specificBlog)
    assert.deepStrictEqual(specificBlog, blogToUpdate)
  })

  test("trying to update a blog that doesn't exists throws 404", async () => {
    const nonExistingId = await helper.nonExistingId()

    const blogToUpdate = {
      title: 'test',
      author: 'test',
      url: 'http://test.com',
      likes: 20,
      id: nonExistingId,
    }

    await api.put(`/api/blogs/${nonExistingId}`).send(blogToUpdate).expect(404)
  })
})

describe('blogs with authentication', () => {
  let token = null

  beforeEach(async () => {
    // Deletes previous users
    await User.deleteMany({})
    // Deletes previous blogs
    await Blog.deleteMany({})

    //Creates new users
    const user1 = {
      username: 'apoque96',
      name: 'dereck',
      password: 'SuperSecretPassword',
    }

    await api
      .post('/api/users')
      .send(user1)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const user2 = {
      username: 'Billy',
      name: 'dereck',
      password: 'aaaaaa',
    }

    await api
      .post('/api/users')
      .send(user2)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // Logs ins
    const credentials = {
      username: 'apoque96',
      password: 'SuperSecretPassword',
    }

    const res = await api
      .post('/api/login')
      .send(credentials)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    token = res.body.token

    // Creates blogs
    const user = await helper.getUser(token)
    const blogs = helper.initialBlogs.map((blog) => ({
      ...blog,
      user: user._id.toString(),
    }))
    await Blog.insertMany(blogs)
  })

  test('can create a new blog', async () => {
    const newBlog = {
      title: 'This is a test bit alert',
      author: 'apoque96',
      url: 'http://reallycooldomain.com',
      like: 0,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const savedBlogs = await helper.blogsInDb()

    assert.strictEqual(savedBlogs.length, helper.initialBlogs.length + 1)

    const titles = savedBlogs.map((e) => e.title)
    assert(titles.includes('This is a test bit alert'))
  })

  test('if a blog is sent without likes, it will default to zero', async () => {
    const newBlog = {
      title: 'This is a test bit alert',
      author: 'apoque96',
      url: 'http://reallycooldomain.com',
    }

    const specificBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const savedBlogs = await helper.blogsInDb()

    assert.strictEqual(savedBlogs.length, helper.initialBlogs.length + 1)

    assert(specificBlog)

    assert.strictEqual(specificBlog.body.likes, 0)
  })

  test('if a blog is sent without title, throws 400', async () => {
    const newBlog = {
      author: 'apoque96',
      url: 'http://reallycooldomain.com',
      likes: 0,
    }

    const specificBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const savedBlogs = await helper.blogsInDb()

    assert.strictEqual(savedBlogs.length, helper.initialBlogs.length)

    assert(specificBlog.body['error'])
  })

  test('if a blog is sent without url, throws 400', async () => {
    const newBlog = {
      title: 'This is a test bit alert',
      author: 'apoque96',
      likes: 0,
    }

    const specificBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const savedBlogs = await helper.blogsInDb()

    assert.strictEqual(savedBlogs.length, helper.initialBlogs.length)

    assert(specificBlog.body['error'])
  })

  test("can't create a blog if not logged in", async () => {
    const newBlog = {
      title: 'This is a test bit alert',
      author: 'apoque96',
      likes: 0,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('delete blog with valid id', async () => {
    await api
      .delete('/api/blogs/5a422b3a1b54a676234d17f9')
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const savedBlogs = await helper.blogsInDb()

    assert.strictEqual(savedBlogs.length, helper.initialBlogs.length - 1)

    const titles = savedBlogs.map((e) => e.title)
    assert(!titles.includes('Canonical string reduction'))
  })

  test('delete blog with invalid id', async () => {
    const nonExistingId = await helper.nonExistingId()

    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const savedBlogs = await helper.blogsInDb()

    assert.strictEqual(savedBlogs.length, helper.initialBlogs.length)
  })
})

after(() => {
  mongoose.connection.close()
})
