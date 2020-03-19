const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
//read db
const db = JSON.parse(fs.readFileSync('./db.json', 'UTF-8'))
const middleware = jsonServer.defaults()
server.use(middleware)
const SECRET_KEY = '123456789'
const expiresIn = '1h'

// Create a token from a payload
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn })
}

// Verify the token
function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY, (err, decode) =>
    decode !== undefined ? decode : err
  )
}

// Check if the user exists in database
function isAuthenticated({ email, password }) {
  return (
    db.employees.findIndex(
      employee => employee.email === email && employee.password === password
    ) !== -1
  )
}

server.post('/auth/login', (req, res) => {
  const status = { UNAUTHORIZED: 401, OK: 200 }
  const { UNAUTHORIZED, OK } = status

  const { email, password } = req.body
  if (isAuthenticated({ email, password }) === false) {
    const message = 'неправильный email адресс или пароль'
    res.status(status).json({ message, status: UNAUTHORIZED })
    return
  }
  const access_token = createToken({ email, password })
  res.status(200).json({ access_token, status: OK })
})

server.use(/^(?!\/auth).*$/, (req, res, next) => {
  if (
    req.headers.authorization === undefined ||
    req.headers.authorization.split(' ')[0] !== 'Bearer'
  ) {
    const status = 401
    const message = 'Не верный заголовок авторизации'
    res.status(status).json({ status, message })
    return
  }
  try {
    verifyToken(req.headers.authorization.split(' ')[1])
    next()
  } catch (err) {
    const status = 401
    const message = 'Ошибка: access_token недействителен'
    res.status(status).json({ status, message })
  }
})

server.use((req, res, next) => {
  setTimeout(() => next(), 1000)
})
server.use(middleware)
server.use(router)
server.listen(4000, () => {
  console.table(`PROTECTED_JSON  сервер запущен 👌😎 port :4000`)
})

// //const userdb = jsonServer.router('./users/users.json');
// const userdb = JSON.parse(fs.readFileSync('./users/users.json', 'UTF-8'))

// const SECRET_KEY = '123456789'
// const expiresIn = '1h'

// // Create a token from a payload
// function createToken(payload) {
//     return jwt.sign(payload, SECRET_KEY, { expiresIn })
// }

// // Verify the token
// function verifyToken(token) {
//     return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)
// }

// // Check if the user exists in database
// function isAuthenticated({ email, password }) {
//     return userdb.users.findIndex(user => user.email === email && user.password === password) !== -1
// }

// server.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
//     res.header("Access-Control-Allow-Headers", "Content-Type");
//     next();
// });
// server.post('/auth/login', (req, res) => {

//     const { email, password, status } = req.body

//     if (isAuthenticated({ email, password }) === false) {
//         const status = 401
//         const message = 'Incorrect email or password'

//         res.status(status).json({ status, message })
//         return
//     }
//     const access_token = createToken({ email, password })
//     res.status(200).json({ access_token, status: 204 })
//     console.log(access_token)

// })

// server.use(/^(?!\/auth).*$/, (req, res, next) => {

//     console.table(req.headers.authorization.split(' ')[0])
//     if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'SuperAdmin') {
//         const status = 401
//         const message = 'Bad authorization header'
//         res.status(status).json({ status, message })
//         return
//     }
//     try {
//         verifyToken(req.headers.authorization.split(' ')[1])
//         setTimeout(() => next(), 1000);
//     } catch (err) {
//         const status = 401
//         const message = 'Error: access_token is not valid'
//         res.status(status).json({ status, message })
//     }
// })

// server.use((req, res, next) => {
//     // setTimeout(() => next(), 1000);
// });

// server.get('/', (req, res) => {
//     res.send('Hello word')
// })

// // server.use(middleware);

// server.use(bodyParser.urlencoded({ extended: true }))
// server.use(bodyParser.json())
// server.use(router);
// server.listen(4000, () => {
//     console.log(`JSON Server is running...`);
// });
