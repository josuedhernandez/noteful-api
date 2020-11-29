const path = require('path')
const express = require('express')
const xss = require('xss')
const NotesService = require('./notes-service')

const notesRouter = express.Router()
const jsonParser = express.json()

const serializeNote = note => ({
  id: note.id,
  note_name: xss(note.note_name),
  content: xss(note.content),
  date_modified: note.date_commented,
  folder_id: note.folder_id,
})

notesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    NotesService.getAllNotes(knexInstance)
      .then(notes => {
        res.json(notes.map(serializeNote))
      })
      .catch(next)
  });
  // .post(jsonParser, (req, res, next) => {
  //   const { text, article_id, user_id, date_commented } = req.body
  //   const newComment = { text, article_id, user_id }

  //   for (const [key, value] of Object.entries(newComment))
  //     if (value == null)
  //       return res.status(400).json({
  //         error: { message: `Missing '${key}' in request body` }
  //       })

  //   newComment.date_commented = date_commented;

  //   NotesService.insertComment(
  //     req.app.get('db'),
  //     newComment
  //   )
  //     .then(comment => {
  //       res
  //         .status(201)
  //         .location(path.posix.join(req.originalUrl, `/${comment.id}`))
  //         .json(serializeNote(comment))
  //     })
  //     .catch(next)
  // })

notesRouter
  .route('/:note_id')
  .all((req, res, next) => {
    NotesService.getById(
      req.app.get('db'),
      req.params.note_id
    )
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: { message: `Note doesn't exist` }
          })
        }
        res.note = note
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeNote(res.note))
  });
  // .delete((req, res, next) => {
  //   NotesService.deleteComment(
  //     req.app.get('db'),
  //     req.params.comment_id
  //   )
  //     .then(numRowsAffected => {
  //       res.status(204).end()
  //     })
  //     .catch(next)
  // })
  // .patch(jsonParser, (req, res, next) => {
  //   const { text, date_commented } = req.body
  //   const commentToUpdate = { text, date_commented }

  //   const numberOfValues = Object.values(commentToUpdate).filter(Boolean).length
  //   if (numberOfValues === 0)
  //     return res.status(400).json({
  //       error: {
  //         message: `Request body must contain either 'text' or 'date_commented'`
  //       }
  //     })

  //   NotesService.updateComment(
  //     req.app.get('db'),
  //     req.params.comment_id,
  //     commentToUpdate
  //   )
  //     .then(numRowsAffected => {
  //       res.status(204).end()
  //     })
  //     .catch(next)
  // })

module.exports = notesRouter;