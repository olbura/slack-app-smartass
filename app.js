const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const PORT = process.env.PORT || 5000

const rnd = (i) => Math.floor(Math.random() * i) + 1
const cmpny = ['Corp.', 'plc', 'LLP', 'Ltd', 'ltd.', 'Inc.', 'GmbH', 'AG', '']

express()
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .post('/', (req, res) => {
        request(`https://api.trackico.io/v1/icos/?q=${req.body.text}`, (error, response, body) => {
            if(!error) {
                let names = JSON.parse(body).map(e => e.title.replace(/ /ig, '').split(/(?=[A-Z])/).join(' ')).join(' ').split(' ')
                req.body.text = names.length > 1 ? 'What about `' + names[rnd(names.length)] + names[rnd(names.length)] + ' ' + cmpny[rnd(cmpny.length)] + '` ?' : 'No idea 😬'
                req.body.response_type = 'in_channel'
                request({
                    method: 'post',
                    body: req.body,
                    json: true,
                    url: req.body.response_url
                }, (e, r, b) => {
                    e && console.log(e, r, b)
                })
            }
        })
        return res.send('')
    })
    .listen(PORT, () => console.log(`Listening on ${PORT}`));