import express from 'express';
import {
	ApolloError,
	ApolloServer,
	gql,
	makeExecutableSchema,
} from 'apollo-server-express';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { applyMiddleware } from 'graphql-middleware';
import path from 'path';
import { GraphQLError } from 'graphql';
import { shield, rule } from 'graphql-shield';
import db from './models';
// import jwt from "jsonwebtoken";

require('dotenv').config();

process.env.TZ = 'America/Argentina/Buenos_Aires';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schemas')));
const resolvers = mergeResolvers(
	fileLoader(path.join(__dirname, './resolvers'))
);

const schema = makeExecutableSchema({ typeDefs, resolvers });

// ##################################################
// autorizacion de usuario: para que funcione descomentar cuando se suba a master
// const isAuthenticated = rule()(async (parent, args, ctx, inf) => {
// 	return !!jwt.verify(ctx.headers["token"], process.env.SECRET_KEY)
// })

const isAuthenticated = rule()(async () => {
	return true;
});

// ##################################################
const permissions = shield({
	Query: { '*': isAuthenticated },
	Mutation: { '*': isAuthenticated },
});

const schemaWithPermissions = applyMiddleware(schema, permissions);

const server = new ApolloServer({
	typeDefs: gql(typeDefs),
	resolvers,
	context: ({ req }) => {
		return {
			headers: req.headers,
			db,
		};
	},
	formatError: (error) => {
		if (error.originalError instanceof ApolloError) {
			return error;
		}
		return new GraphQLError(`Ha ocurrido un error: ${error.message}`);
	},
	schema: schemaWithPermissions,
});

// Express middleware
const app = express();
server.applyMiddleware({ app });

db.sequelize.sync().then(() => {
	app.listen({ port: 4000 }, () => {
		console.log(
			`🚀 Server ready at http://localhost:4000${server.graphqlPath}`
		);
	});
});
