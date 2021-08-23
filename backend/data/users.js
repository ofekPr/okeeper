import bcrypt from 'bcryptjs'

const users = [
    {
        userName: 'John Lenon',
        email: 'john@Lenon.com',
        password: bcrypt.hashSync('john1234', 10),
        pages: [
            {
              name: 'assay',
              text: 'alsnslkasndklansdlnasdnlandkasnd',
              files: [],
              publicViewing: true,
              publicEditing: false
            },
            {
              name: 'List',
              text: 'a, b, c, d, e, f, g, h, i, j, k, l',
              files: [],
              publicViewing: false,
              publicEditing: false
            },
            {
              name: 'work',
              text: 'hello world lorem imposum',
              files: [],
              publicViewing: true,
              publicEditing: true
            },
            {
              name: 'English Work',
              text: null,
              files: ['./files/work.txt'],
              publicViewing: true,
              publicEditing: false
            },
        ]
    },
    {
        userName: 'Roy Cohen',
        email: 'roy@cohen.com',
        password: bcrypt.hashSync('roy1234', 10),
        pages: [
            {
              name: 'a',
              text: 'asdasdasd',
              files: [],
              publicViewing: true,
              publicEditing: false
            },
            {
              name: 'List',
              text: 'a, b, c, d, e, f, g, h, i, j, k, l',
              files: [],
              publicViewing: false,
              publicEditing: false
            },
            {
              name: 'shopping list',
              text: 'hello world lorem imposum',
              files: [],
              publicViewing: true,
              publicEditing: true
            },
            {
              name: 'Math Work',
              text: null,
              files: ['./files/work.txt'],
              publicViewing: true,
              publicEditing: false
            },
        ]
    }
]

export default users