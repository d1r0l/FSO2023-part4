var _ = require('lodash')

const dummy = (blogs) => {
  //..
  return 1
}

const totalLikes = (blogs) => {
  const likesArray = blogs.map(blog => blog.likes)
  const likesSum = likesArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
  return blogs.array === 0
    ? 0
    : likesSum
}

const favoriteBlog = (blogs) => {
  const likesArray = blogs.map(blog => blog.likes)
  const maxLikes = Math.max(...likesArray)
  const maxLikesBlogIndex = likesArray.indexOf(maxLikes)
  const favoriteBlog = {
    title: blogs[maxLikesBlogIndex].title,
    author: blogs[maxLikesBlogIndex].author,
    likes: blogs[maxLikesBlogIndex].likes
  }
  return favoriteBlog
}

const mostBlogs = (blogs) => {
  const autorsArray = blogs.map(blog => blog.author)
  const autorsOccurences = _.countBy(autorsArray)
  const mostOccurentAuthor = _.maxBy(_.keys(autorsOccurences), (key) => autorsOccurences[key])
  const occurencyCount = autorsOccurences[mostOccurentAuthor]

  const mostBlogs = {
    author: mostOccurentAuthor,
    blogs: occurencyCount
  }

  return mostBlogs
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}
