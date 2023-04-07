const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');

const swaggerJSDoc = require('swagger-jsdoc');


const swaggerUi = require(`swagger-ui-express`),
swaggerDocument = require(`./swagger.json`);

// const PORT = process.env.PORT || 3500;



// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));


const options = {
    definition:{
        openapi: '3.0.0',
        info:{
            title: 'Node JS API Project for mySQL',
            version: '1.0.0',
        },
        servers:[{
            url:'http://localhost:3500/'
        }],components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./server.js']
}

const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(verifyJWT);

app.use('/employees', require('./routes/api/employees'));



// /** 
// * @swagger
// * /:
// *   get:
// *       summary: This API is used to if all method is working or not
// *       description: This API is used to if all method is working or not
// *       responses:
// *               200:
// *                  description: To test all method
// */
app.get('/',(req,res)=>{
    res.send("Welecome to world");
})




// /**
//  * @swagger
//  * /employees:
//  *  get:
//  *      summary: To get all employees from mySQL.
//  *      description: This API is used to fetch data from mySQL
//  *      responses:
//  *          200:
//  *              description: This API is used to fetch data from mySQL
//  *              content:
//  *                  application/json:
//  *                      schema:
//  *                          type: array
//  *                          items:
//  *                              $ref: '#components/schema/employees'
//  */

app.get('/employees',(req,res)=>{
    database.collection('employees').find({}).toArray((err,result)=>{
        if(err) throw err
        resp.send(result)
    })
})

// /**
//  * @swagger
//  *  components:
//  *      schema:
//  *          employees:
//  *                  type: object
//  *                  properties:
//  *                      id:
//  *                          type: integer
//  *                      firstname:
//  *                          type: string
//  *                      lastname:
//  *                          type: string
//  *                      
//  */


// /**
//  * @swagger
//  * /employees/{id}:
//  *  get:
//  *      summary: To get all employees from mySQL.
//  *      description: This API is used to fetch data from mySQL
//  *      parameters:
//  *          - in: path
//  *            name: id
//  *            required: true
//  *            description: Numeric ID required
//  *            schema:
//  *              type: integer
//  *      responses:
//  *          200:
//  *              description: This API is used to fetch data from mySQL
//  *              content:
//  *                  application/json:
//  *                      schema:
//  *                          type: array
//  *                          items:
//  *                              $ref: '#components/schema/employees'
//  */

app.get('/employees/:id',(req,res)=>{
    database.collection('employees').find({id: parseInt(req.params.id)}).toArray((err,result)=>{
        if(err) throw err
        resp.send(result)
    })
})





app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const PORT = process.env.PORT || 3500;                //localhost is running on the port number 3500
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
module.exports = app;