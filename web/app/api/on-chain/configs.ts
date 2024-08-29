import { GraphQLClient } from 'graphql-request';

const SUBGRAPH_URL = process.env.SUBGRAPH_URL ?? '';

export const subgraphClient = new GraphQLClient(SUBGRAPH_URL);
