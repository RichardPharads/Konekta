import url from 'url'
import http, { request, WebSocket } from 'http'
import {WebSocketServer} from 'ws'



const server = http.createServer()
const wss = new WebSocketServer({server})
const users = new Map()
users.set()
// wss.on("connect" , (connect , request) => {
//     const {username} = url.parse(request.url ,true ).query
//     console.log(username)
    
// })

wss.on('connection' , (ws , request) => {
    const params = new URLSearchParams(url.parse(request.url).query)
    console.log(url.parse(request.url))
    const user = params.get('user') || 'Guess';

    console.log("Connected to server! " + user)
    ws.send(`Welcome to the club ${user}`)

    wss.clients.forEach(clients => {
        if(clients.readyState === WebSocket.OPEN){
            clients.send(`New user Join ${user}`)
        }
    })


    ws.on('message' , message => {
        wss.clients.forEach(client => {
            if(client.readyState === WebSocket.OPEN){
                client.send(`${user}: ${message}`)
            }
        })
    })

    ws.on('close' , () => {
        console.log(`${user} is Disconnected`)
        wss.clients.forEach(clients => {
            clients.send(`${user} Leave the Chat`)
        })
    })
})


server.listen(3000, () => {
    console.log("running on port 3000")
})