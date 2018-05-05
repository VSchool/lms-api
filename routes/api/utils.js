module.exports = {
    daySortCallback : (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
}