const path = require('path')
const express = require('express')
const app = express()
const port = 3000

app.get('/', function(req,res) {
  res.sendFile(__dirname + '/public/index.html')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.use('/static', express.static(path.join(__dirname, 'public')))
