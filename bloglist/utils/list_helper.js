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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
