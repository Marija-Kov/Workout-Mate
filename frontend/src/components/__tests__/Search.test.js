import { render, screen } from "@testing-library/react";
import { act } from "react";
import "@testing-library/jest-dom";
import user from "@testing-library/user-event";
import Search from "../Search";
import store from "../../redux/store";
import { Provider } from "react-redux";

let dispatch;
let mockUser = {
  id: "userid",
  email: "keech@mail.yu",
  username: undefined,
  profileImg: undefined,
};

beforeAll(() => {
  dispatch = store.dispatch;
  dispatch({ type: "LOGIN", payload: mockUser });
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
    const searchInput = screen.getByPlaceholderText(/type workout title/i);
    expect(searchForm).toHaveAttribute("class", "search--bar");
    expect(searchInputLabel).toBeInTheDocument();
    expect(searchInputLabel).toHaveAttribute("class", "hidden");
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveValue("");
  });

  it("should update input value as user types, go to the first page of search results and show 'clear' button", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <Search />
      </Provider>
    );
    const searchInput = screen.getByPlaceholderText(/type workout title/i);
    expect(searchInput).toHaveValue("");
    act(() => dispatch({ type: "GO_TO_PAGE_NUMBER", payload: 2 }));
    let state = store.getState();
    expect(state.page).toBe(2);
    await user.type(searchInput, "pu");
    expect(searchInput).toHaveValue("pu");
    const clearBtn = await screen.findByRole("button");
    expect(clearBtn).toBeInTheDocument();
    state = store.getState();
    expect(state.page).toBe(0);
  });

  it("should clear the search bar when 'clear' button is clicked", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <Search />
      </Provider>
    );
    const searchInput = screen.getByPlaceholderText(/type workout title/i);
    await user.type(searchInput, "pu");
    const clearBtn = await screen.findByRole("button");
    await user.click(clearBtn);
    expect(searchInput).toHaveValue("");
  });
});
