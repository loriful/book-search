const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    savedBooks: [bookSchema]
    bookCount: Int
  }

  type bookSchema {
    _id: ID
    authors: String
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }

  type Auth {
    token: ID!
    user: User
  }

  
  type Query {
    getSingleUser(username: String, _id: ID): User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    createUser(username: String!, email: String!, password: String!): Auth
    saveBook(userId: ID!, authors: [String], description: String!, bookId: String!, image: String, link: String, title:String!): User
    deleteBook(userId: ID!, bookId: ID!): User
  }
`;

module.exports = typeDefs;
