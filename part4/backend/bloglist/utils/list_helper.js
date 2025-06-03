const dummy = (blogs) => 1

const totalLikes = (blogs) => {
  return blogs.reduce((acc, cur) => acc + cur.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  let favorite = blogs[0]

  blogs.forEach((blog) => {
    if (blog.likes > favorite.likes) favorite = blog
  })

  return favorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const map = {}

  blogs.forEach((blog) => {
    if (!map[blog.author]) map[blog.author] = { author: blog.author, blogs: 0 }

    map[blog.author].blogs++
  })

  let ans = map[blogs[0].author]

  for (const key in map) {
    if (map[key].blogs > ans.blogs) ans = map[key]
  }

  return ans
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const map = {}

  blogs.forEach((blog) => {
    if (!map[blog.author]) map[blog.author] = { author: blog.author, likes: 0 }

    map[blog.author].likes += blog.likes
  })

  let ans = map[blogs[0].author]

  for (const key in map) {
    if (map[key].likes > ans.likes) ans = map[key]
  }

  return ans
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
