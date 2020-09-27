export default `
  type Category {
    id: ID!
    desc: String!
  }

  type Query {
    categories: [Category!]!
    category(id: ID!): Category
  }

  type Mutation {
    createCategory(desc: String): Category!
    updateCategory(id: ID!, desc: String): [Int!]!
    deleteCategory(id: ID!): Int!
  }
`;