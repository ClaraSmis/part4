const dummy = (blogs) => {
    return 1
  }
  
  const totalLikes = (blogs) => {
      return blogs.reduce((sum, currentlikes) => sum + currentlikes.likes, 0)
  }
  
  const favoriteBlog = (blogs) => {
      var arrayLikes = blogs.map(result => result.likes)
      var favorite = arrayLikes.indexOf(Math.max(...arrayLikes))
      return blogs[favorite]
  }
    
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }