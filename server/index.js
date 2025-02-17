const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": "67117039751213001a42abc6",
      "PLAID-SECRET": "b82711b5ead9c75d9acd0675f3f1c3",
    },
  },
});
const plaidClient = new PlaidApi(configuration);
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/hello", (request, response) => {
  response.json({ message: "hello " + request.body.name });
});

app.post("/create_link_token", async function (request, response) {
  const plaidRequest = {
    user: {
      // This should correspond to a unique id for the current user.
      client_user_id: "user",
    },
    client_name: "Plaid Test App",
    products: ["auth"],
    language: "en",
    redirect_uri: "http://localhost:5173/",
    country_codes: ["US", "GB"],
  };
  try {
    const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
    response.json(createTokenResponse.data);
  } catch (error) {
    // handle error
    response.status(500).send("failure");
  }
});

app.post("/auth", async function (request, response) {
  try {
    const access_token = request.body.access_token;
    const plaidRequest = {
      access_token: access_token,
    };
    const plaidResponse = await plaidClient.authGet(plaidRequest);
    response.json(plaidResponse.data);
  } catch (e) {
    response.status(500).send("failed");
  }
});

app.post("/exchange_public_token", async function (request, response, next) {
  const publicToken = request.body.public_token;
  try {
    const plaidResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    // These values should be saved to a persistent database and
    // associated with the currently signed-in user
    const accessToken = plaidResponse.data.access_token;

    response.json({ accessToken });
  } catch (error) {
    response.status(500).send("failed");
  }
});

app.listen(8000, () => {
  console.log("server started on port 8000");
});
