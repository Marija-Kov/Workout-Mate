// src/mocks/server.js
import { setupServer } from "msw/node";
import { rest } from "msw";

const handlers = [
  rest.post("api/users/signup", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: "Account created and pending confirmation",
      })
    );
  }),
  rest.get("api/users/:accountConfirmationToken", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: "Account confirmed, you may log in",
      })
    );
  }),
];

// This configures a request mocking server with the given request handlers.
const server = setupServer(...handlers);

export { server, rest }
