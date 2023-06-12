import { ApolloServer } from "@apollo/server";
    import { startStandaloneServer } from "@apollo/server/standalone";
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";

const typeDefs =  `
type Business {
businessId: ID!
name: String!
city: String!
state: String!
address: String!
location: Point!
reviews: [Review!]! @relationship(type: "REVIEWS", direction: IN)
categories: [Category!]!
@relationship(type: "IN_CATEGORY", direction: OUT)
}
type User {
userID: ID!
name: String!
reviews: [Review!]! @relationship(type: "WROTE", direction: OUT)
}
type Review {
reviewId: ID!
stars: Float!
date: Date!
text: String
user: User! @relationship(type: "WROTE", direction: IN)
business: Business! @relationship(type: "REVIEWS", direction: OUT)
}
type Category {
name: String!
businesses: [Business!]!
@relationship(type: "IN_CATEGORY", direction: IN)
}
`;

const driver = neo4j.driver(
    "bolt://localhost:7687",
    neo4j.auth.basic("neo4j", "lN10n10$2023")
    );

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

const server = new ApolloServer({
    schema: await neoSchema.getSchema(),
});

await startStandaloneServer(server, {
    context: async ({ req }) => ({ req }),
});