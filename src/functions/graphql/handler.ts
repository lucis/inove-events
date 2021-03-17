import "source-map-support/register";

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { graphql, buildSchema } from "graphql";

import inoveEvents from './queries/inoveEvents'

const gqlSchema = buildSchema(`
  type Event {
    name: String
    date: String
    description: String
  }
 
  type Query {
    inoveEvents(search: String): [Event]
  }
`);


const root = {
  inoveEvents
}

const gqlHandler: ValidatedEventAPIGatewayProxyEvent<{}> = (
  event,
  _,
  callback
) => {
  graphql(gqlSchema, event.queryStringParameters.query, root).then(
    (result) => callback(null, formatJSONResponse(result as {})),
    (err) => callback(err)
  );
};

export const main = middyfy(gqlHandler);
