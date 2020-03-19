const faker = require('faker')
const nanoid = require('nanoid')

const database = { employees: [], statistics: [] }
// const fake = Faker()
faker.locale = 'ru'

function arrayRandElement(arr) {
  var rand = Math.floor(Math.random() * arr.length)
  return arr[rand]
}

const position = [
  'Дизайнер',
  'Разработчик',
  'Бухгалтер',
  'Редактор',
  'Контент-Менеджер',
]
const contractor = [true, false]
const month = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]
const years = [2020]
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min //Максимум и минимум включаются
}
function createEmployees(n) {
  const { employees } = database
  for (let i = 0; i <= n; i++) {
    employees.push({
      id: nanoid(4),
      name: faker.name.findName(),
      email: faker.internet.email(),
      position: arrayRandElement(position),
      contractor: arrayRandElement(contractor),
      password: nanoid(6),
    })
  }
}

createEmployees(20)

function createStatistics(n) {
  const { statistics } = database
  for (let i = 0; i < n; i++) {
    statistics.push({
      id: i + 1,
      year: years[0],
      month: month[i],
      ordersComplite: getRandomIntInclusive(100, 500),
      ordersFallen: getRandomIntInclusive(100, 500),
      visitors: getRandomIntInclusive(1000, 5000),
      goods: getRandomIntInclusive(35, 100),
      conversion: getRandomIntInclusive(5, 35),
      totalСostOfGoods: getRandomIntInclusive(750, 2000),
      objectiveOrdersComplite: getRandomIntInclusive(100, 500),
      objectiveConversion: getRandomIntInclusive(5, 50),
    })
  }
}
createStatistics(12)

console.log(JSON.stringify(database))
