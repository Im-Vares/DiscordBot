const express = require("express")
const server = express()

server.all("/",(req,res) => {
   res.send("Бот работает")
})

function keepAlive() {
  server.listen(3000,() => {
    console.log("Сервер готов")
  })
}

module.exports = keepAlive
