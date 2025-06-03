const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  try {
    const user = request.user

    const blog = new Blog({
      ...request.body,
      user: user._id,
    })

    if (!blog.likes) blog.likes = 0

    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    response.status(201).json(result)
  } catch (err) {
    next(err)
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if (!blog || !blog.user) return response.status(204).end()

    if (blog.user.toString() !== request.user._id.toString())
      return response
        .status(401)
        .json({ error: "cannot delete a blog that you didn't create" })

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (err) {
    next(err)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if (!blog) return response.status(404).end()

    const { title, author, url, likes } = request.body

    blog.title = title
    blog.author = author
    blog.url = url
    blog.likes = likes

    const updatedBlog = await blog.save()

    return response.json(updatedBlog)
  } catch (err) {
    next(err)
  }
})

module.exports = blogsRouter
