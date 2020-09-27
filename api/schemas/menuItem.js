export default `
  type Item {
    id: ID!
    title: String!
    desc: String
    cookTime: Int
    servings: Float
    pricePerUnit: Float
  }

  type Query {
    items: [Item!]!
    item(id: ID!): Item
  }

  type Mutation {
    createItem(item: itemInput!): Item!
    updateItem(id: ID!, item: itemInput!): [Int!]!
    deleteItem(id: ID!): Int!
  }

  input itemInput{
    title: String!
    desc: String 
    cookTime: Int 
    servings: Float 
    pricePerUnit: Float
  }
`;