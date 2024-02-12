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
afterEach(() => {
  act(() => dispatch({ type: "RESET_QUERY_STATE" }));
  act(() => dispatch({ type: "RESET_PAGE_STATE" }));
});
afterAll(() => {
  act(() => dispatch({ type: "LOGOUT" }));
  dispatch = null;
  mockUser = null;
});

describe("<Search />", () => {
  it("should render search form properly", () => {
    render(
      <Provider store={store}>
        <Search />
      </Provider>
    );
    const searchForm = screen.getByTestId("search-form");
    const searchInputLabel = screen.getByText(/search:/i);
    const searchInput = screen.getByPlaceholderText(/type workout name/i);
    const searchBtn = screen.getByRole("button");
    expect(searchForm).toHaveAttribute("class", "search--bar");
    expect(searchInputLabel).toBeInTheDocument();
    expect(searchInputLabel).toHaveAttribute("class", "hidden");
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
    const searchInput = screen.getByPlaceholderText(/type workout name/i);
    expect(searchInput).toHaveValue("");
    act(() => dispatch({ type: "GO_TO_PAGE_NUMBER", payload: 2 }));
    let state = store.getState();
    expect(state.page).toBe(2);
    await user.type(searchInput, "pu");
    expect(searchInput).toHaveValue("pu");
    state = store.getState();
    expect(state.page).toBe(0);
  });

  it("should disable clicking on search button while workouts are being loaded", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <Search />
      </Provider>
    );
    const searchForm = screen.getByTestId("search-form");
    const searchBtn = screen.getByRole("button");
    act(() => dispatch({ type: "SET_WORKOUTS_REQ" }));
    expect(searchForm).toHaveAttribute("class", "search--bar is--loading");
    expect(searchBtn).toBeDisabled();
  });
});
