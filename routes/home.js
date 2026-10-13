import express from "express";

const router = express.Router()


router.route('/')
  .get((req, res) => {
    res.send('Hi, welcome to the API')
  })


export default router