const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const fs = require('fs')
const PATH = 'data.json'

const PORT = 5000
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get("/contacts", (req, res) => {
    fs.readFile(PATH, 'utf8', (err, data) => {
        if (err) {
          console.error(err)
          return res.status(500).send('Erro ao ler os dados')
        }
        res.json(JSON.parse(data))
    })
})

app.listen(PORT, () => {
    console.log(`Server is running in PORT: ${PORT} ...`)
})