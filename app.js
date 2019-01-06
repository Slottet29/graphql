const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const events = [];

app.use(bodyParser.json());

//establishing main endpoint
//you may call the endpoint what you want!
// back-ticks ` allow me to write multiline scripts

//ID! means that ID must NEVER be null

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type clinicUser {
            _id: ID!
            firstname: String!
            lastname: String!
            alias: String
            title: String
            description: String
            mail: String!
            phone: String
            orgref: [String!]!
            roles: [String!]!
            createddatetime: String
            createdby: String
            changeddatetime: String
            changedby: String
            deleted: Boolean
            cpr: String
            externalidentifiers: [String]
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
    
        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        type RootSubscription {
            subscribe: String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
            subscription: RootSubscription
        }
    `),
    rootValue: {
        events: () => {
            return events;
        }, //must be named equal to the schema types
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date
            }
            events.push(event);
            return event;
        },
        subscribe: () => {

        }
    },
    graphiql: true,
})); 

app.listen(3000);