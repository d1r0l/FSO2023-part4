var _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  //..
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  } else {
    const likesArray = blogs.map((blog) => blog.likes)
    const likesSum = likesArray.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    )
    return likesSum
  }
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {
      title: 'No blogs was found',
      author: 'No authors was found',
      likes: 0
    }
  } else {
    const likesArray = blogs.map((blog) => blog.likes)
    const maxLikes = Math.max(...likesArray)
    const maxLikesBlogIndex = likesArray.indexOf(maxLikes)
    const favoriteBlog = {
      title: blogs[maxLikesBlogIndex].title,
      author: blogs[maxLikesBlogIndex].author,
      likes: blogs[maxLikesBlogIndex].likes
    }
    return favoriteBlog
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {
      author: 'No authors was found',
      blogs: 0
    }
  } else {
    const autorsArray = blogs.map((blog) => blog.author)
    const autorsOccurences = _.countBy(autorsArray)
    const mostOccurentAuthor = _.maxBy(
      _.keys(autorsOccurences),
      (key) => autorsOccurences[key]
    )
    const occurencyCount = autorsOccurences[mostOccurentAuthor]

    const mostBlogs = {
      author: mostOccurentAuthor,
      blogs: occurencyCount
    }

    return mostBlogs
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {
      author: 'No authors was found',
      likes: 0
    }
  } else {
    const repetetiveAuthorsLikes = blogs.map((blog) => ({
      [blog.author]: blog.likes
    }))
    const authorsLikes = _.reduce(
      repetetiveAuthorsLikes,
      function (result, value) {
        const key = _.keys(value)[0]
        !result[key] ? (result[key] = value[key]) : (result[key] += value[key])
        return result
      },
      []
    )
    const authorWithMostLikes = _.maxBy(
      _.keys(authorsLikes),
      (key) => authorsLikes[key]
    )
    const likesCount = authorsLikes[authorWithMostLikes]

    const mostLikes = {
      author: authorWithMostLikes,
      likes: likesCount
    }

    return mostLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
