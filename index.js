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
          return res.status(500).send('Error reading data')
        }
        return res.json(JSON.parse(data))
    })
})

app.post('/contacts', (req, res) => {
    fs.readFile(PATH, 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        return res.status(500).send('Error reading data')
      }
  
      const contacts = JSON.parse(data)
      const newContact = req.body
      const { id } = newContact
      const hasContact = contacts.find(contact => contact.id === id)

      if(!!hasContact){
        return res.status(409).send({message: 'Contact alredy exits'})
      }

      contacts.push(newContact)

      fs.writeFile(PATH, JSON.stringify(contacts), (err) => {
        if (err) {
          console.error(err)
          return res.status(500).send('Error saving contacts')
        }
        return res.status(200).send(JSON.stringify(newContact))
      })
    })
})

app.listen(PORT, () => {
    console.log(`Server is running in PORT: ${PORT} ...`)
})