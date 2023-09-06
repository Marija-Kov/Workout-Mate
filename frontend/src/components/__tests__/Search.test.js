import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import user from "@testing-library/user-event";
import Search from "../Search";
import store from '../../redux/store'
import { Provider } from 'react-redux'

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
  dispatch({type: "LOGIN_SUCCESS", payload: mockUser})
});

afterAll(() => {
  act(() => dispatch({type: "LOGOUT"}))
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
      const searchInput = await screen.findByPlaceholderText(/search workouts/i);
      const searchBtn = await screen.findByText(/search/i);
      expect(searchInput).toBeInTheDocument();
      expect(searchBtn).toBeInTheDocument();
      expect(searchInput).not.toBeDisabled();
      expect(searchBtn).not.toBeDisabled();
    });
    
    it("should disable search form while workout data is being loaded", async () => {
      render(
      <Provider store={store}>
        <Search />
      </Provider>
      );
      act(() => dispatch({type: "SET_WORKOUTS_REQ"}));
      const searchInput = await screen.findByPlaceholderText(/search workouts/i);
      const searchBtn = await screen.findByLabelText(/search button/i);
      expect(searchInput).toBeDisabled();
      expect(searchBtn).toBeDisabled();
      act(() => dispatch({type: "SET_WORKOUTS_SUCCESS", payload: []}))
    });

    it("should update input value as user types and go to the first page of search results", async () => {
      user.setup();
      render(
        <Provider store={store}>
          <Search />
        </Provider>
        );
      const searchInput = await screen.findByPlaceholderText(/search workouts/i);
      act(() => dispatch({type: "GO_TO_PAGE_NUMBER", payload: 2}))
      let state = store.getState();
      expect(state.page).toBe(2);
      await user.type(searchInput, "pu");
      expect(searchInput).toHaveValue("pu");
      state = store.getState();
      expect(state.page).toBe(0);
      act(() => dispatch({type: "SET_QUERY", payload: ""}))
    });
})
