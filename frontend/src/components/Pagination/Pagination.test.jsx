import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import Pagination from "./Pagination";
import { genSampleWorkouts } from "../../utils/test/genSampleWorkouts";
import store from "../../redux/store";
import { Provider } from "react-redux";

describe("<Pagination />", () => {
  const mockUser = {
    id: "userid",
    email: "keech@mail.yu",
    username: undefined,
    profileImg: undefined,
  };

  beforeAll(() => {
    store.dispatch({ type: "LOGIN", payload: mockUser });
    genSampleWorkouts();
  });

  afterEach(() => store.dispatch({ type: "RESET_PAGE_STATE" }));

  afterAll(() => {
    store.dispatch({
      type: "RESET_WORKOUTS_STATE",
      payload: "All workouts deleted successfully",
    });
    store.dispatch({ type: "LOGOUT" });
  });
  it("should render the Pagination component properly in its initial state if 6+ workouts exist in the database", () => {
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
    let foundCount = state.workouts.foundCount;
    let limit = state.workouts.limit;
    expect(numButtons.length).toBe(Math.ceil(foundCount / limit));
  });

  it("should focus the elements in the correct order", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <Pagination />
      </Provider>
    );
    const prev = screen.getByLabelText(/previous page/i);
    const next = screen.getByLabelText(/next page/i);
    let page2 = screen.getByLabelText(/page 2/i);
    await user.click(page2); // going to page2 to enable prev button
    await user.tab({ shift: true });
    await user.tab({ shift: true });
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
