import '../util/loadEnv.js'


export default [
  {
    firstName: "Roberto",
    lastName: "Gomez",
    nickName: "robertg",
    email: "robertg@example.com",
    password: process.env.ADMIN_PASSWORD,
    passwordConfirm: process.env.ADMIN_PASSWORD,
    role: "admin"
  },
  {
    firstName: "Jenifer",
    lastName: "Perez",
    nickName: "jeniperez",
    email: "jenp@example.com",
    password: process.env.CLERK_PASSWORD,
    passwordConfirm: process.env.CLERK_PASSWORD,
    role: "clerk"
  }
]

