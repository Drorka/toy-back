const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
// const toyService = require('./services/toy.service.js')
// const userService = require('./services/user.service.js')

const app = express()
const http = require('http').createServer(app)

// Express App Config
app.use(cookieParser())
app.use(express.json())
// app.use(express.static('public'))

if (process.env.NODE_ENV === 'production') {
	// Express serve static files on production environment
	app.use(express.static(path.resolve(__dirname, 'public')))
} else {
	// Configuring CORS
	const corsOptions = {
		// Make sure origin contains the url your frontend is running on
		origin: [
			'http://127.0.0.1:8080',
			'http://localhost:8080',
			'http://127.0.0.1:3000',
			'http://localhost:3000',
		],
		credentials: true,
	}
	app.use(cors(corsOptions))
}

const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const toyRoutes = require('./api/toy/toy.routes')
const { setupSocketAPI } = require('./services/socket.service')

const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware')
app.all('*', setupAsyncLocalStorage)

// routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/toy', toyRoutes)
setupSocketAPI(http)

// Make every server-side-route to match the index.html
// so when requesting http://localhost:3030/index.html/car/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue-router to take it from there
app.get('/**', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const logger = require('./services/logger.service')
const port = process.env.PORT || 3030
http.listen(port, () => {
	logger.info('Server is running on port: ' + port)
})

///////////////////////////////////////////////
// // Real routing express
// // List
// app.get('/api/toy', (req, res) => {
// 	console.log('get req.query', req.query)
// 	const filterBy = req.query
// 	toyService
// 		.query(filterBy)
// 		.then((toys) => {
// 			res.send(toys)
// 		})
// 		.catch((err) => {
// 			console.log('Error:', err)
// 			res.status(400).send('Cannot get toys')
// 		})
// })

// // Update
// app.put('/api/toy', (req, res) => {
// 	// const loggedinUser = userService.validateToken(req.cookies.loginToken)
// 	// if (!loggedinUser) return res.status(401).send('Cannot update toy')
// 	console.log('put req.body', req.body)
// 	const toy = req.body
// 	console.log('CAR ---------', toy)
// 	toyService
// 		.save(toy)
// 		.then((savedToy) => {
// 			res.send(savedToy)
// 		})
// 		.catch((err) => {
// 			console.log('Error:', err)
// 			res.status(400).send('Cannot update toy')
// 		})
// })

// // Create
// app.post('/api/toy', (req, res) => {
// 	console.log('post req.body', req.body)

// 	// const loggedinUser = userService.validateToken(req.cookies.loginToken)
// 	// if (!loggedinUser) return res.status(401).send('Cannot add toy')

// 	const toy = req.body
// 	toyService
// 		.save(toy)
// 		.then((savedToy) => {
// 			res.send(savedToy)
// 		})
// 		.catch((err) => {
// 			console.log('Error:', err)
// 			res.status(400).send('Cannot create toy')
// 		})
// })

// // Read - GetById
// app.get('/api/toy/:toyId', (req, res) => {
// 	console.log('get req.params', req.params)

// 	const { toyId } = req.params
// 	toyService
// 		.get(toyId)
// 		.then((toy) => {
// 			res.send(toy)
// 		})
// 		.catch((err) => {
// 			console.log('Error:', err)
// 			res.status(400).send('Cannot get toy')
// 		})
// })

// // Remove
// app.delete('/api/toy/:toyId', (req, res) => {
// 	console.log('delete req.params', req.params)

// 	// const loggedinUser = userService.validateToken(req.cookies.loginToken)
// 	// if (!loggedinUser) return res.status(401).send('Cannot update toy')

// 	const { toyId } = req.params
// 	toyService
// 		.remove(toyId)
// 		.then(() => {
// 			res.send({ msg: 'Toy removed successfully', toyId })
// 		})
// 		.catch((err) => {
// 			console.log('Error:', err)
// 			res.status(400).send('Cannot delete toy')
// 		})
// })

// * User API:
// List
// app.get('/api/user', (req, res) => {
//     const filterBy = req.query
//     userService.query(filterBy)
//         .then((users) => {
//             res.send(users)
//         })
//         .catch(err => {
//             console.log('Error:', err)
//             res.status(400).send('Cannot get users')
//         })
// })

// app.get('/api/user/:userId', (req, res) => {
//     const { userId } = req.params
//     userService.get(userId)
//         .then((user) => {
//             res.send(user)
//         })
//         .catch(err => {
//             console.log('Error:', err)
//             res.status(400).send('Cannot get user')
//         })
// })

// app.post('/api/user/login', (req, res) => {
//     const { username, password } = req.body
//     userService.login({ username, password })
//         .then((user) => {
//             const loginToken = userService.getLoginToken(user)
//             res.cookie('loginToken', loginToken)
//             res.send(user)
//         })
//         .catch(err => {
//             console.log('Error:', err)
//             res.status(400).send('Cannot login')
//         })
// })

// app.post('/api/user/signup', (req, res) => {
//     const { fullname, username, password, score } = req.body
//     userService.signup({ fullname, username, password, score })
//         .then((user) => {
//             const loginToken = userService.getLoginToken(user)
//             res.cookie('loginToken', loginToken)
//             res.send(user)
//         })
//         .catch(err => {
//             console.log('Error:', err)
//             res.status(400).send('Cannot signup')
//         })
// })

// app.post('/api/user/logout', (req, res) => {
//     res.clearCookie('loginToken')
//     res.send('Logged out')
// })

// Listen will always be the last line in our server!
app.listen(3031, () => console.log('Server listening on port 3031!'))
