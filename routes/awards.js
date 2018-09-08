const express = require('express')
const router = express.Router()

// Bring in Award Model
let Award = require('../models/award')

// User Model
let User = require('../models/user')


// Add Route
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('add_article', {
    title: 'Add Award'
  })
})

// Add Submit POST Route
router.post('/add', (req, res) => {
  req.checkBody('title', 'Title is required').notEmpty()
  req.checkBody('body', 'Body is required').notEmpty()

  // Get Errors
  let errors = req.validationErrors()

  if (errors) {
    res.render('add_article', {
      title: 'Add Award',
      errors
    })
  } else {
    let award = new Award()
    award.title = req.body.title
    award.author = req.user._id
    award.body = req.body.body

    award.save(err => {
      if (err) {
        console.log(err)
      } else {
        req.flash('success', 'Award Added')
        res.redirect('/')
      }
    })
  }
})

// Load Edit Form
router.get('/edit/:id', (req, res) => {
  Award.findById(req.params.id, (err, award) => {
    if (err) {
      console.log(err)
    } else {
      if (award.author != req.user._id) {
        req.flash('danger', 'Not Authorized')
        res.redirect('/')
      }
      award.name = req.user.name
      res.render('edit_article', {
        title: 'Edit Award',
        award
      })
    }
  })
})

// Update Submit POST Route
router.post('/edit/:id', (req, res) => {
  let award = {}
  award.title = req.body.title
  award.author = req.body.author
  award.body = req.body.body

  let query = { _id: req.params.id }

  Award.update(query, award, err => {
    if (err) {
      console.log(err)
    } else {
      req.flash('success', 'Award Updated')
      res.redirect('/')
    }
  })
})

// Delete Award
router.delete('/:id', (req, res) => {
  if (!req.user._id) {
    res.status(500).send()
  }

  let query = { _id: req.params.id }

  Award.findById(req.params.id, (err, award) => {
    if (award.author != req.user._id) {
      res.status(500).send()
    } else {
      Award.remove(query, err => {
        if (err) {
          console.log(err)
        }
        else {
          res.send('Success')
        }
      })
    }
  })

})

// Get Single Award
router.get('/:id', (req, res) => {
  Award.findById(req.params.id, (err, award) => {
    if (err) {
      console.log(err)
    } else {
      User.findById(award.author, (err, user) => {
        if (err) {
          console.log(err)
        } else {
          res.render('award', {
            award,
            author: user.name
          })
        }
      })
    }
  })
})

// Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    req.flash('danger', 'Please login')
    res.redirect('/users/login')
  }
}

module.exports = router
