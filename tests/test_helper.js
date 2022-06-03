const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: "Test",
    author: "Clara",
    url: "https://test.com",
    likes: 12
  },
  {
    title: "Test2",
    author: "Clara2",
    url: "https://test2.com",
    likes: 15
  },
  {
    title: "Test3",
    author: "Clara3",
    url: "https://test3.com",
    likes: 15
  }
]

const InitialUsers = [
  {
    username: "root", 
    name: "Test", 
    password: "test"
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'fullstack', url:'fullstack.com', likes:36 })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, InitialUsers, nonExistingId, blogsInDb, usersInDb
}