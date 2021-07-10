const express = require('express')
const path = require('path')
const hbs=require('hbs')
const geocode=require('./utils/geocode')
const forecast=require('./utils/forecast')
const request = require('postman-request')


const app = express()

const port= process.env.PORT || 3000 //let port be environment variable for heroku or local port

const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath=path.join(__dirname, '../templates/partials')

app.set('views', viewsPath) //set the views directory to our custom dir : 'templates'
//setup handlebar engine and views location
app.set('view engine', 'hbs')

hbs.registerPartials(partialsPath)
 
//Define pths for Express config
//setup static dir to serve
app.use(express.static(path.join(__dirname, '/../public'))) // use the public directory

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather fetcher app',
        name: 'Tom Li'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Tom Li'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is the help page, if you have any trouble please contact 5875009882',
        title:'Help',
        name: 'Tom Li'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'You must provide an address'
        }) // return early to stop sending response twice : http can only send once
    }

    geocode(req.query.address, (error,{latitude,longitude,location}={})=>{
        if(error){
            return res.send({error})
        }

        forecast(latitude,longitude,(error,forecastData)=>{
            if(error){
                return res.send({error})
            }

            res.send({
                forecast:forecastData,
                location,
                address:req.query.address
            })
        })
    })
   
})

// use wildcard to show specific message when user try to look for information under help page
app.get('/help/*',(req,res)=>{
    res.render('404',{
        title:'404 Help',
        name: 'Tom',
        errorMessage:'Error 404: Help Article not found'

    })
})

app.get('/products',(req,res)=>{
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        }) // return early to stop sending response twice : http can only send once
    }

    req.query
    res.send({
        products:[]
    })
})

//404 page
app.get('*',(req,res)=>{
    res.render('404',{
        title:'404',
        name: 'Tom',
        errorMessage:'Page not found'

    })
})


app.listen(port, () => {
    console.log('Server is up on port '+port)
})