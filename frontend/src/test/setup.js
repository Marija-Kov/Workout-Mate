import { expect, afterEach, afterAll, beforeAll } from "vitest";
import "@testing-library/jest-dom";
import { server } from "./mocks/server";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

const originalError = console.error;
const actWarnings = [];

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
  // suppress act warnings
  console.error = (...args) => {
    if (/should be wrapped into act/.test(args[0])) {
      actWarnings.push(args[0]);
      return;
    }
    originalError.call(console, ...args);
  };
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
});

afterAll(() => {
  server.close();
  console.error = originalError;
  setTimeout(() => {
    if (actWarnings.length)
      console.error(`Got ${actWarnings.length} act warnings`);
  });
});
