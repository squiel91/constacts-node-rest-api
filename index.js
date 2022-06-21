const express = require('express')
const fs = require('fs/promises');

const bootsrap = async () => {
  const app = express()
  app.use(express.json())
  
  contactos = []
  
  const save = async () => {
    await fs.writeFile("contactos.json", JSON.stringify(contactos), 'utf8')
    console.log("JSON file has been saved.");
  }
  
  const load = async () => {
    try {
      contactos = JSON.parse(await fs.readFile("contactos.json", 'utf8'))
    } catch (error) {
      contactos = []
    }
    console.log("JSON file has been loaded.");
  }
  
  await load()
  
  app.get('/contactos', (req, res) => {
    res.json(contactos)
  })
  
  app.get('/contactos/:id', (req, res) => {
    const user = contactos.find(user => user.id === parseInt(req.params.id))
    if (!user) {
      res.status(404).json({ error: 'Contacto no encontrado' })
    }
    res.json(user)
  })
  
  app.post('/contactos', async (req, res) => {
    let nuevoContacto =  req.body
    if (!nuevoContacto?.nombre) {
      return res.status(400).json({ error: 'nombre is required' })
    }
    if (!nuevoContacto?.telefono) {
      return res.status(400).json({ error: 'telefono is required' })
    }
    nuevoContacto = { ...nuevoContacto, id: contactos.length + 1 }
    contactos.push(nuevoContacto)
    await save()
    res.json(nuevoContacto)
  
  })
  
  app.put('/contactos/:id', (req, res) => {
    const contactoOriginal = contactos.find(user => user.id === parseInt(req.params.id))


  
    let updatedContacto = req.body
    if (!updatedContacto?.nombre) {
      return res.status(400).json({ error: 'nombre is required' })
    }
    if (!updatedContacto?.telefono) {
      return res.status(400).json({ error: 'telefono is required' })
    }
    updatedContacto = { ...updatedContacto, id: contactoOriginal.id }
    contactos = contactos.map(user => user.id === parseInt(req.params.id) ? updatedContacto : user)
    res.json(updatedContacto)
  })
  
  app.delete('/contactos/:id', (req, res) => {
    const user = contactos.find(user => user.id === parseInt(req.params.id))
    if (!user) {
      return res.status(404).json({ error: 'Contacto no encontrado' })
    }
    contactos = contactos.filter(user => user.id !== parseInt(req.params.id))
    res.json(user)
  })
  
  app.use((req, res) => {
    res.status(404).json({ error: "Endpoint no encontrado" })
  })
  
  app.listen(4000, () => {
    console.log('App listening on port 4000.')
  })
}

bootsrap()