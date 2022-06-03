const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are the right number of blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: "Testnew",
        author: "Claranew",
        url: "https://testnew.com",
        likes: 20,
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const response = await api.get('/api/blogs')
  
    const contents = response.body.map(r => r.title)
  
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(contents).toContain(
        'Testnew', 
    )
})

test('blog without likes is added with likes = 0', async () => {
  const newBlog = {
    title: 'without likes',
    author: 'test', 
    url: 'notlikes.com'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)

  expect(response.body.likes).toBeDefined()
})
  test('blog without title and url is not added', async () => {
    const newBlog = {
      author: "Clara",
      likes:13
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blog is deleted', async () => {
    const newBlog = {
      title: 'deleted',
      author: 'fullstack', 
      url: 'deleted.com',
      likes: 12
    }
  
    const added = await api
      .post('/api/blogs')
      .send(newBlog)

    const response = await api
      .delete(`/api/blogs/${added.body.id}`)
  
    expect(response.status).toBe(204)
  })

  test('blog is updated', async () => {
    const newBlog = {
      title: 'toUpdate',
      author: 'fullstack', 
      url: 'toupdate.com',
      likes: 12
    }
  
    const added = await api
      .post('/api/blogs')
      .send(newBlog)

    const UpdateBlog = {
        title: 'toUpdate',
        author: 'fullstack', 
        url: 'toupdate.com',
        likes: 35
      }
    

      await api
      .put(`/api/blogs/${added.body.id}`)
      .send(UpdateBlog)

    const result = await api
      .get(`/api/blogs/${added.body.id}`)


      expect(result.body.likes).toBe(newBlog.likes)
    
  })



afterAll(() => {
  mongoose.connection.close()
})