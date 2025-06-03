const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const listWithZeroBlogs = []

const listWithSeveralBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
]

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0,
  },
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)

  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('when list is empty, equals 0', () => {
    const result = listHelper.totalLikes(listWithZeroBlogs)
    assert.strictEqual(result, 0)
  })

  test('when list has several blogs, equals the sum of all likes', () => {
    const result = listHelper.totalLikes(listWithSeveralBlogs)
    assert.strictEqual(result, 36)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
})

describe('favorite blog', () => {
  test('when list is empty, returns null', () => {
    const result = listHelper.favoriteBlog(listWithZeroBlogs)
    assert.deepStrictEqual(result, null)
  })

  test('when list has several blogs, returns the correct one', () => {
    const result = listHelper.favoriteBlog(listWithSeveralBlogs)
    assert.deepStrictEqual(result, listWithSeveralBlogs[2])
  })

  test('when list has only one blog, returns the only one', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result, listWithOneBlog[0])
  })
})

describe('most blogs', () => {
  test('when list is empty, returns null', () => {
    const result = listHelper.mostBlogs(listWithZeroBlogs)
    assert.deepStrictEqual(result, null)
  })

  test('when list has several blogs, returns the correct one', () => {
    const result = listHelper.mostBlogs(listWithSeveralBlogs)

    const author = { author: 'Robert C. Martin', blogs: 3 }

    assert.deepStrictEqual(result, author)
  })

  test('when list has only one blog, returns the only one', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)

    const author = { author: 'Edsger W. Dijkstra', blogs: 1 }

    assert.deepStrictEqual(result, author)
  })
})

describe('most likes', () => {
  test('when list is empty, returns null', () => {
    const result = listHelper.mostLikes(listWithZeroBlogs)
    assert.deepStrictEqual(result, null)
  })

  test('when list has several blogs, returns the correct one', () => {
    const result = listHelper.mostLikes(listWithSeveralBlogs)

    const author = { author: 'Edsger W. Dijkstra', likes: 17 }

    assert.deepStrictEqual(result, author)
  })

  test('when list has only one blog, returns the only one', () => {
    const result = listHelper.mostLikes(listWithOneBlog)

    const author = { author: 'Edsger W. Dijkstra', likes: 5 }

    assert.deepStrictEqual(result, author)
  })
})
