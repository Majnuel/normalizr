import express from 'express'
const app = express()

app.use(express.json())

let gatos: any[] = []

app.get('/gatos', (req, res) => {
    res.json(gatos)

})

app.post('/gatos', (req, res) => {
    const { id, nombre, raza, edad } = req.body
    const gato = {
        id,
        nombre,
        raza,
        edad
    }
    gatos.push(gato)
    //201: creado
    res.sendStatus(201)
})


//para poder pedir un gato en particular mediante el id,  EL ID TIENE QUE SER STRING EN EL JSON O NO FUNCIONA!
app.get('/gatos/:id', (req, res) => {
    const id = req.params.id
    const gato = gatos.find(gato => gato.id === id)
    if (!gato) {
        res.sendStatus(404)
    }
    res.json(gato)
})

//actualizar una raza de gato con PATCH
app.patch('/gatos/:id/raza', (req, res) => {
    //primero me fijo si el gato existe
    const id = req.params.id
    const gato = gatos.find(gato => gato.id === id)
    if (!gato) {
        res.sendStatus(404)
    }
    const { raza } = req.body
    gato.raza = raza
    res.sendStatus(204)
})

//borrar un gato
app.delete('/gatos/:id', (req, res) => {
    //primero me fijo si el gato existe
    const id = req.params.id
    const gato = gatos.find(gato => gato.id === id)
    if (!gato) {
        res.sendStatus(404)
    }
    gatos = gatos.filter(gato => gato.id != id)
    res.sendStatus(200)
})

// app.get('/:users', (req, res) => {
//     res.send({
//         params: req.params,
//         queryParams: req.query,
//         body: req.body
//     })
// })

// app.post('/:users', (req, res) => {
//     res.send({
//         params: req.params,
//         queryParams: req.query,
//         body: req.body
//     })
// })



app.listen(3000, () => {
    console.log('server is up and running')
})