import express, { Application } from "express"
import dayjs from "dayjs"
import fs from "fs"
import { normalize, schema } from 'normalizr'
const faker = require('faker')
const app: Application = express()
const handlebars = require('express-handlebars')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
// const { sqlite3Connect } = require('./sqlite3.db')
// const knex = require('knex')({
//     client: 'sqlite3',
//     connection: {
//         filename: "../chat.sqlite"
//     },
//     useNullAsDefault: true,
// })

// creacion de tabla con KNEX
// knex.schema.createTable('mensajes', (table: any) => {
//     table.string('id')
//     table.string('timestamp',)
//     table.string('msg')
// })
//     .then(() => console.log('table created!'))
//     .catch((err: any) => { console.log(err) })
//     .finally(() => knex.destroy())


// knex('mensajes').insert(obj4sqlite)
//     .then(() => console.log('mensajes inserted'))
//     .catch((err: any) => console.log(err))
//     .finally(() => knex.destroy())

// TEST INSERT
// const testMsg = [
//     {
//         id: 'unID',
//         timestamp: '321',
//         msg: 'negro',
//     }, {
//         id: 'otroID',
//         timestamp: '1111',
//         msg: 'rojo',
//     }
// ]

// knex('mensajes').insert(testMsg)
//     .then(() => console.log('mensajes inserted'))
//     .catch((err: any) => console.log(err))
//     .finally(() => knex.destroy)


//LEER DESDE LA BASE
// knex.from('mensajes').select('*')
//     .then((rows: any) => console.log(rows))
//     .catch((err: any) => { console.log(err) })
// .finally(() => knex.destroy())

const text = new schema.Entity('text')
const author = new schema.Entity("author")
const mensaje = new schema.Entity('mensaje', {
    author: author,
    text: text
})


if (!fs.existsSync('./chatLog.txt')) {
    fs.writeFileSync('./chatLog.txt', '')
    console.log('chatLog.txt creado')
}

let user: string = ''

io.on('connection', (socket: any) => {
    console.log('se conectó un usuario')
    socket.on('newProduct', (producto: object) => {
        console.log("nuevo producto via socket.io: ", producto)
        io.emit('newProduct', producto)
    })
    socket.on("email", (newChat: any) => {
        console.log('chat iniciado')
        console.log(newChat)
        user = newChat
    })
    socket.on("chat", (newChatMsg: any) => {
        console.log(newChatMsg)
        const timestamp = dayjs()
        const obj = {
            author: {
                user: user,
                timestamp: timestamp,
                age: Math.floor(Math.random() * (100 - 12 + 1)) + 12,
                alias: faker.hacker.noun(),
                avatar: faker.image.avatar()
            },
            text: newChatMsg,
        }
        console.log('obj in server: ', obj)
        const normalizedObj = normalize(obj, mensaje)
        //ESTO ESTA MAL, ESTOY DUPLICANDO EL OBJETO Y LLAMANDO A FAKER OTRA VEZ
        const objWithNormedMsg = {
            ...obj,
            normalizedObj: normalizedObj
        }

        io.emit("chat", objWithNormedMsg)

        // const obj4sqlite = {
        //     id: user,
        //     timestamp: timestamp,
        //     msg: newChatMsg,
        // }

        //INSERTAR NUEVO OBJETO EN KNEX
        // knex('mensajes').insert(obj4sqlite)
        //     .then(() => console.log('mensajes inserted'))
        //     .catch((err: any) => console.log(err))
        // .finally(() => knex.destroy())

        const stringified = JSON.stringify(obj)
        fs.appendFileSync('./chatLog.txt', '\n' + stringified)
    })
})

app.engine("hbs", handlebars({
    extname: '.hbs',
    defaultLayout: "index.hbs",
    layoutsDir: process.cwd() + "/views/layouts",
    partialsDir: process.cwd() + "/views/partials"
}))

// console.log(process.cwd() + "/desafio-10/src/views/layouts")

app.get('/test', (req, res) => {
    // res.send('Testing...')
    res.render("test", { test: true })
})

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(express.json())
app.use('/api', require('./rutas/routing'))
app.use('/productos', require('./rutas/routing'))

http.listen(7777, () => {
    console.log('server is live on port 7777')
})

app.set('views', './views');
app.set('view engine', 'hbs');