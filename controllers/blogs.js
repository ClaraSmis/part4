const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})
  
blogsRouter.post('/', async (request, response) => {
  const body = request.body 
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  if(blog.likes === null || typeof blog.likes === 'undefined')
  {
    blog.likes = 0
  }

  if(blog.title === null || typeof blog.title === 'undefined' || blog.url === null || typeof blog.url === 'undefined')
  {
    response.status(400).end() 
  }
  else
  {
    const savedBlog = await blog.save() 
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  if (!request.token || !request.decodedToken) {
    return response.status(401).json({ error: 'token missing or invalid' })
}
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() === request.decodedToken.id.toString()) {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } else {
        response.status(400).end()
    }
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body 

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  const result = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true })
  response.json(result.toJSON())
})

module.exports = blogsRouter