const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
// const cors = require('cors');

const middleware = jsonServer.defaults()
server.use(middleware)
server.use(bodyParser.json({ limit: '5mb' }))
server.use(bodyParser.urlencoded({ extended: true }))
const SECRET_KEY = '123456789'
const expiresIn = '1h'





// server.use(bodyParser.json())
// server.use(bodyParser.urlencoded({ extended: true }))

//read db
const db = JSON.parse(fs.readFileSync('./db.json', 'UTF-8'))

function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn })
}

// // Verify the token
function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY, (err, decode) =>
    decode !== undefined ? decode : err
  )
}

// // Check if the user exists in database
function isAuthenticated({ email, password }) {
  console.log(`email : ${email}, password: ${password}`)
  console.log(email, password)
  return (
    db.employees.findIndex(
      employee => employee.email === email && employee.password === password
    ) !== -1
  )
}

server.post('/auth/login', (req, res, next) => {
  const status = { UNAUTHORIZED: 401, OK: 201 }
  const { UNAUTHORIZED, OK } = status

  const { email, password } = req.body

  if (isAuthenticated({ email, password }) === false) {

    const info = 'неправильный email адресс или пароль'

    setTimeout(() => res.status(UNAUTHORIZED).json({ status: 401, info }), 2000)
    return
  }
  const access_token = createToken({ email, password })
  setTimeout(() => res.status(OK).json({ status: 200, access_token, }), 2000)

})

server.use(/^(?!\/auth).*$/, (req, res, next) => {
  console.log(req.headers.authorization)
  if (
    req.headers.authorization === undefined ||
    req.headers.authorization.split(' ')[0] !== 'Bearer'
  ) {
    const status = 401
    const message = 'Не верный заголовок авторизации'
    console.log(message)
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



server.post('/images', (req, res, next) => {
  try {
    const base64String = req.body[0]
    if (base64String !== undefined) {
      let base64Image = base64String.split(';base64,').pop()
      fs.writeFile('image.png', base64Image, { encoding: 'base64' }, function (err) {
        console.log('File created');
      })
    }
  } catch (err) {
    console.log(err)
  }



  // const { email, password } = req.body

  // if (isAuthenticated({ email, password }) === false) {

  //   const info = 'неправильный email адресс или пароль'

  //   setTimeout(() => res.status(UNAUTHORIZED).json({ status: 401, info }), 2000)
  //   return
  // }
  // const access_token = createToken({ email, password })

  setTimeout(() => res.status(200).json({ status: 200 }), 2000)

})



server.use((req, res, next) => {
  setTimeout(() => next(), 2000);
});
server.use(router)

server.listen(4000, () => {
  console.table(`PROTECTED_JSON  сервер запущен 👌😎 port :4000`)
})

// //const userdb = jsonServer.router('./users/users.json');
