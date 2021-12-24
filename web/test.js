const path = require('path')
const fs = require('fs')

const postsDirectory = path.join(process.cwd(), 'posts')
const fileNames = fs.readdirSync(postsDirectory)
console.log(fileNames)
fileNames.map( fileName => {
        console.log(fileName)
    }
)