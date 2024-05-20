const express = require('express');
 const cors = require('cors')
 const mysql = require('mysql2')

const app = express();

// middleware

app.use(express.json())

app.use(express.urlencoded({ extended: true }))


// routers
const router = require('./routes/trackingtRouter.js')
app.use('/api/tracking', router)




//port

const PORT = process.env.PORT || 8082

//server

app.listen(PORT, () => {
 console.log(`server is running on port ${PORT}`)

})