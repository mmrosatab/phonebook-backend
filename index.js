const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator')
const { Sequelize, DataTypes } = require('sequelize')

const PORT = 5000
const app = express()

const validateContact = [
  body('name').notEmpty().withMessage('Name is required'),
  body('phonenumber').notEmpty().withMessage('Phonenumber is required'),
  body('email').isEmail().withMessage('Invalid email address'),
]

// Configure Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite', // Nome do arquivo de banco de dados SQLite
})

// Define o modelo de dados
const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
})

// Sincronize o modelo com o banco de dados (cria a tabela se não existir)
sequelize.sync().then(() => {
  console.log('Database is synchronized')
})

app.use(cors())
app.use(bodyParser.json())

app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.findAll()
    return res.json(contacts)
  } catch (error) {
    console.error(error)
    return res.status(500).send('Error reading data')
  }
})

app.get('/contact/:id', async (req, res) => {
  const { id } = req.params
  try {
    const contact = await Contact.findByPk(parseInt(id))
    return res.status(200).json(contact)
  } catch (error) {
    console.error(error)
    return res.status(500).send('Error reading data')
  }
})

app.post('/contact', validateContact, async (req, res) => {

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const newContact = req.body
    const createdContact = await Contact.create(newContact)
    return res.status(200).json(createdContact)
  } catch (error) {
    console.error(error)
    return res.status(500).send('Error saving contact')
  }
})

app.put('/contact/:id', async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const contact = req.body
    const { id } = req.params
    const destroyedRows = await Contact.update(contact, {
      where: {
        id
      }
    })
    return res.status(200).json(destroyedRows)
  } catch (error) {
    console.error(error)
    return res.status(500).send('Error update contact')
  }

})

app.delete('/contact/:id', async (req, res) => {
  try {
    const { id } = req.params
    const destroyedRows = await Contact.destroy({
      where: {
        id
      }
    })

    return res.status(200).json(destroyedRows)
  } catch (error) {
    console.error(error)
    return res.status(500).send('Error saving contact')
  }
})

app.listen(PORT, () => {
    console.log(`Server is running in PORT: ${PORT} ...`)
})