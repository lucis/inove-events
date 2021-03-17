import { GraphQLFieldResolver } from "graphql";
import { Agent } from "https";
import axios from "axios";
import { load } from "cheerio";
const inoveEvents: GraphQLFieldResolver<any, any> = async ({ search }) => {
  const page = await axios
    .get("https://inove.quixada.ufc.br/?page_id=50", {
      httpsAgent: new Agent({
        rejectUnauthorized: false,
      }),
    })
    .then(({ data }) => data);

  const $ = load(page);

  const treat = (txt: string) => txt.replace(/(\r\n|\n|\r)/gm, "").trim();

  const names = $(".row .col-12 .card-title")
    .toArray()
    .map((el) => $(el).text())
    .map(treat);

  const dates = $(".row .col-12 #data")
    .toArray()
    .map((el) => $(el).text())
    .map(treat);

  const descriptions = $(".row .col-12 .content")
    .toArray()
    .map((el) => $(el).text())
    .map(treat);

  const events = names.map((name, i) => ({
    name,
    date: dates[i],
    description: descriptions[i],
  })).filter(({ name }) => name.toLowerCase().includes(search.toLowerCase()));

  return events;
};

export default inoveEvents;
