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

module.exports = {
  dummy,
  totalLikes
}
