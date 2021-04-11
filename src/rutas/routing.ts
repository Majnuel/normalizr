import express, { Application, Request, Response } from "express"
const Product = require(".././classModule")
const app: Application = express()
const router = express.Router()

export let id: number = 1

export let productos: any[] = []

router.get('/vista', (req, res) => {
    res.render("main", {
        productos: productos, listExists: true
    })

})
console.log("current working directory of the Node.js process:", process.cwd())

router.get('/test', (req, res) => {
    // res.send('Testing...')
    res.render("test", { test: true })
})


app.use(express.json())

router.get('/', (req, res) => {
    res.send('Pagina principal de la API')
})

router.get('/productos', (req, res) => {
    res.json(productos)
})

router.patch('/productos/:id', (req, res) => {

    const id: number = parseInt(req.params.id)
    const queryParams = req.query

    const product = productos.find(item => item.id === id)
    if (!product) {
        res.sendStatus(404)
    }
    if (Object.values(queryParams).length > 1) {
        res.send('You may only modify one property at a time')
    }
    const key = Object.keys(queryParams)[0]
    const newValue = Object.values(queryParams)[0]
    console.log('id: ', id)
    console.log(typeof id)
    console.log('query params', queryParams)
    console.log(Object.keys(queryParams))
    console.log(key, newValue)

    // product.key = newValue
    //ME AGREGA LA PROPIEDAD KEY EN LUGAR DEL VALOR DE LA VARIABLE KEY. 
    //COMO DEBERIA HACERLO PARA NO USAR EL SWITCH? GONZA???

    switch (key) {
        case 'title':
            product.title = newValue
            console.log(product)
            break;
        case 'price':
            product.price = newValue
            console.log(product)
            break;
        case 'thumbnail':
            product.thumbnail = newValue
            console.log(product)
            break
        default:
            res.send('No such property on product')
            break;
    }
    res.sendStatus(204)
})

router.post('/productos', (req, res) => {
    console.log(`post en /productos recibido, body: , ${req.body}`)
    console.log(req.body)
    const { title, price, thumbnail } = req.body
    const newProduct: any = new Product(title, price, thumbnail, id++)
    productos.push(newProduct.showProduct())
    //res.json(newProduct)
    res.sendStatus(201)
    //res.redirect("http://localhost:7777/index.html")

    //NO PUEDO ENVIAR LAS DOS COSAS "CANNOT SET HEADERS AFTER THEY ARE SENT TO THE CLIENT" GONZA??
})

router.delete('/productos/:id', (req, res) => {
    const id: number = parseInt(req.params.id)
    const product = productos.find(item => item.id === id)
    if (!product) {
        res.sendStatus(404)
    }
    productos = productos.filter(product => product.id != id)
    res.sendStatus(200)
})

router.get('/productos/:id', (req, res) => {
    const id: number = parseInt(req.params.id)
    const product = productos.find(item => item.id === id)
    if (!product) {
        res.sendStatus(404)
    }
    res.json(product)
})


app.set('view engine', 'hbs');
app.set('views', './views');
app.set('view options', { layout: './layouts/layout' });

module.exports = router

