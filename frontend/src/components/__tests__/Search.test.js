import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import user from "@testing-library/user-event";
import Search from "../Search";
import store from "../../redux/store";
import { Provider } from "react-redux";

let dispatch;
let mockUser = {
  id: "userid",
  email: "keech@mail.yu",
  token: "authorizationToken",
  username: undefined,
  profileImg: undefined,
  tokenExpires: Date.now() + 3600000,
};

beforeAll(() => {
  dispatch = store.dispatch;
  dispatch({ type: "LOGIN_SUCCESS", payload: mockUser });
});

afterAll(() => {
  act(() => dispatch({ type: "LOGOUT" }));
  dispatch = null;
  mockUser = null;
});

describe("<Search />", () => {
  it("should render search form properly", async () => {
    render(
      <Provider store={store}>
        <Search />
      </Provider>
    );
    const searchForm = await screen.findByLabelText(/search bar/i);
    const searchInput = await screen.findByPlaceholderText(/search workouts/i);
    const searchBtn = await screen.findByLabelText(/search button/i);
    expect(searchForm).toBeInTheDocument();
    expect(searchForm).toHaveAttribute("class", "search--bar");
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveValue("");
    expect(searchBtn).toBeInTheDocument();
  });

  it("should update input value as user types and go to the first page of search results", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <Search />
      </Provider>
    );
    const searchInput = await screen.findByPlaceholderText(/search workouts/i);
    expect(searchInput).toHaveValue("");
    act(() => dispatch({ type: "GO_TO_PAGE_NUMBER", payload: 2 }));
    let state = store.getState();
    expect(state.page).toBe(2);
    await user.type(searchInput, "pu");
    expect(searchInput).toHaveValue("pu");
    state = store.getState();
    expect(state.page).toBe(0);
    act(() => dispatch({ type: "SET_QUERY", payload: "" }));
  });

  it("should disable clicking on search button while workouts are being loaded", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <Search />
      </Provider>
    );
    const searchForm = await screen.findByLabelText(/search bar/i);
    const searchBtn = await screen.findByLabelText(/search button/i);
    act(() => dispatch({ type: "SET_WORKOUTS_REQ" }));
    expect(searchForm).toHaveAttribute("class", "search--bar is--loading");
    expect(searchBtn).toBeDisabled();
    act(() => dispatch({ type: "SET_WORKOUTS_SUCCESS", payload: [] }));
    act(() => dispatch({ type: "SET_QUERY", payload: "" }));
  });
});
