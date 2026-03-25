require('dotenv').config({ debug: true });
const app = require("./src/app.js")
const connectDB = require("./src/db/db.js")

connectDB()

app.get('/pings',(req,res)=>{
    res.json({message: "server is active"})
})

app.listen(3000,()=>{
    console.log("Server started")
})


