import React from "react";
import { render, screen, act } from "@testing-library/react";
import user from "@testing-library/user-event";
import Pagination from "../Pagination";
import { genSampleWorkouts } from "../../utils/test/genSampleWorkouts";
import store from "../../redux/store";
import { Provider } from "react-redux";

let mockWorkouts;
let dispatch;
let mockUser;

beforeAll(() => {
  dispatch = store.dispatch;
  mockUser = {
    id: "userid",
    email: "keech@mail.yu",
    token: "authorizationToken",
    username: undefined,
    profileImg: undefined,
    tokenExpires: Date.now() + 3600000,
  };
  dispatch({ type: "LOGIN_SUCCESS", payload: mockUser });
  mockWorkouts = genSampleWorkouts();
});
afterEach(() => dispatch({ type: "RESET_PAGE_STATE" }));
afterAll(() => {
  dispatch({
    type: "DELETE_ALL_WORKOUTS_SUCCESS",
    payload: "All workouts deleted successfully",
  });
  dispatch({ type: "LOGOUT" });
  mockWorkouts = null;
  dispatch = null;
  mockUser = null;
});

describe("<Pagination />", () => {
  it("should render Pagination component correctly in its initial state given that 6+ workouts exist in the database", () => {
    render(
      <Provider store={store}>
        <Pagination />
      </Provider>
    );
    const numButtons = screen.getAllByLabelText(/go to page/i);
    const page1 = screen.getByLabelText(/page 1/i);
    const page2 = screen.getByLabelText(/page 2/i);
    const page3 = screen.getByLabelText(/page 3/i);
    const prev = screen.getByLabelText(/previous page/i);
    const next = screen.getByLabelText(/next page/i);
    expect(prev).toBeInTheDocument();
    expect(prev).toHaveAttribute("disabled");
    expect(next).toBeInTheDocument();
    expect(page1).toHaveAttribute("class", "num--page current");
    expect(page2).toHaveAttribute("class", "num--page");
    expect(page3).toHaveAttribute("class", "num--page");
    let state = store.getState();
    let total = state.workout.workouts.total;
    let limit = state.workout.workouts.limit;
    expect(numButtons.length).toBe(Math.ceil(total / limit));
  });

  it("should focus elements in the correct order", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <Pagination />
      </Provider>
    );
    const prev = screen.getByLabelText(/previous page/i);
    const next = screen.getByLabelText(/next page/i);
    let page2 = screen.getByLabelText(/page 2/i);
    await user.click(page2);
    await user.tab();
    expect(prev).toHaveFocus();
    await user.tab();
    const page1 = await screen.findByLabelText(/page 1/i);
    expect(page1).toHaveFocus();
    await user.tab();
    page2 = await screen.findByLabelText(/page 2/i);
    expect(page2).toHaveFocus();
    await user.tab();
    const page3 = await screen.findByLabelText(/page 3/i);
    expect(page3).toHaveFocus();
    await user.tab();
    expect(next).toHaveFocus();
  });

  it("should highlight corresponding page when pages are changed back and forth clicking on 'next' and 'previous' buttons", async () => {
    render(
      <Provider store={store}>
        <Pagination />
      </Provider>
    );
    user.setup();
    let prev = screen.getByLabelText(/previous page/i);
    let next = screen.getByLabelText(/next page/i);
    let page1 = screen.getByText(1);
    let page2 = screen.getByText(2);
    let page3 = screen.getByText(3);
    expect(page1).toHaveAttribute("class", "num--page current");
    expect(page2).toHaveAttribute("class", "num--page");
    expect(page3).toHaveAttribute("class", "num--page");
    await user.click(next);
    page1 = await screen.findByText(1);
    page2 = await screen.findByText(2);
    page3 = await screen.findByText(3);
    expect(page1).toHaveAttribute("class", "num--page");
    expect(page2).toHaveAttribute("class", "num--page current");
    expect(page3).toHaveAttribute("class", "num--page");
    await user.click(next);
    page1 = await screen.findByText(1);
    page2 = await screen.findByText(2);
    page3 = await screen.findByText(3);
    next = await screen.findByLabelText(/next page/i);
    expect(page1).toHaveAttribute("class", "num--page");
    expect(page2).toHaveAttribute("class", "num--page");
    expect(page3).toHaveAttribute("class", "num--page current");
    expect(next).toHaveAttribute("disabled");
    await user.click(prev);
    page1 = await screen.findByText(1);
    page2 = await screen.findByText(2);
    page3 = await screen.findByText(3);
    next = await screen.findByLabelText(/next page/i);
    expect(page1).toHaveAttribute("class", "num--page");
    expect(page2).toHaveAttribute("class", "num--page current");
    expect(page3).toHaveAttribute("class", "num--page");
    expect(next).not.toHaveAttribute("disabled");
  });

  it("should highlight page number p when it is clicked", async () => {
    render(
      <Provider store={store}>
        <Pagination />
      </Provider>
    );

    user.setup();
    let page1 = screen.getByText(1);
    let page2 = screen.getByText(2);
    let page3 = screen.getByText(3);
    await user.click(page3);
    page1 = await screen.findByText(1);
    page2 = await screen.findByText(2);
    page3 = await screen.findByText(3);
    expect(page1).toHaveAttribute("class", "num--page");
    expect(page2).toHaveAttribute("class", "num--page");
    expect(page3).toHaveAttribute("class", "num--page current");
  });
});
