const axios = require('axios')
const jsdom = require('jsdom')

const { JSDOM } = jsdom

module.exports = getUSD = () => {
  const usd = new Promise((resolve, reject) => {
    axios.get('https://eltoque.com/tasas-de-cambio-de-moneda-en-cuba-hoy')
    .then((data) => {
      const dom = new JSDOM(data.data)
      const container = dom.window.document.querySelector('#cell-title1')
        .parentElement
        .parentElement
        .children[2]
        .children[1]

      resolve(container.textContent)
    })
    .catch((error) => {
      reject(error)
    })
  })

  return usd
}