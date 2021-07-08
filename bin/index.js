#!/usr/bin/env node

/**
 * Import dependencies.
 */
const yargs = require('yargs')
const axios = require('axios')
const boxen = require('boxen')
const chalk = require('chalk')

// Style message box with boxen Module
const boxenStyle = {
  padding: 1,
  margin: 1,
  borderStyle: 'classic',
  borderColor: 'yellow',
  backgroundColor: 'yellow'
}

// Configure yards module for requiring CLI arguments
const options = yargs
  .usage('Usage: -f <conversion factor> -c <"category">')
  .option('f', { alias: 'factor', describe: 'Conversion factor', type: 'number', demandOption: true })
  .option('c', { alias: 'category', describe: 'Search category', type: 'string', demandOption: true })
  .argv

// Log error if conversion factor is not in acceppted form
if (isNaN(options.factor) || options.factor <= 0) {
  console.log('Valid Conversion Factor must be bigger than 0 ...')
  return
}

const base_url = 'http://wp8m3he1wt.s3-website-ap-southeast-2.amazonaws.com'
const requestPage = async(pagePath) => {
  const request = await axios.get(base_url + pagePath, { headers: { Accept: 'application/json' } })
  return request.data
}

const getAllProducts = async() => {
  let nextPath = '/api/products/1'
  let products = []
  while(nextPath){
    try {
      let response = await requestPage(nextPath)
      products = products.concat(response.objects)
      nextPath = response.next
    }
    catch (exception) {
      console.log('Can\'t fetch data from provided API')
      return
    }
  }
  return products
}


const calculateWeight = async() => {

  const allProducts = await getAllProducts()
  if(!allProducts) return

  const categories =  Array.from(new Set(allProducts.map(i => i.category)))
  const productsOfCategory = allProducts.filter(i => i.category===options.category)
  const n = productsOfCategory.length

  // Calculate gross volume of all products in the category for search
  let totalVolume = 0
  if (n>0) {
    productsOfCategory.forEach( p => {
      let newObj = Object.create(p)
      newObj.calcVol = function(){
        let pdtVol = 1
        for (let i in this.size) {
          pdtVol *= this.size[i]
        }
        return pdtVol
      }
      totalVolume += newObj.calcVol()
    })

    // Calculate average cubic weight with custom factor(options.factor)
    // Output result as an interger, in grams.
    const averageW = (totalVolume*(options.factor)/(1000)/n).toFixed(0)
    var message = `Average Weight of ${options.category} is ${averageW} Grams`
  } else {

    // Log message to suggest user providing a valid category, if
    // no products found in the category searched.
    message = `Must provide one valid category in "${categories.join('""')}"`
  }

  // Log result, use "chalk" to modify text & background color
  const msgBox = boxen(chalk.rgb(0,0,0)(message), boxenStyle )
  console.log(msgBox)
}

console.log(`Calculating for category ${options.category}...`)

calculateWeight()