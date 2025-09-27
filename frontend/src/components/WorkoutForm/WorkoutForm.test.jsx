import WorkoutForm from "./WorkoutForm";
import App from "../../mocks/App";
import user from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";
import { Provider } from "react-redux";
import store from "../../redux/store";

let dispatch;
let mockUser = {
  id: "userid",
  email: "keech@mail.yu",
  username: undefined,
  profileImg: undefined,
};

beforeAll(() => (dispatch = store.dispatch));
beforeEach(() => dispatch({ type: "LOGIN", payload: mockUser }));
afterEach(() => {
  dispatch({ type: "RESET_WORKOUTS_STATE" });
  dispatch({ type: "LOGOUT" });
});
afterAll(() => {
  dispatch = null;
  mockUser = null;
});

describe("<WorkoutForm/>", () => {
  it("should render Workout form given that user is authenticated", async () => {
    render(
      <Provider store={store}>
        <WorkoutForm />
      </Provider>
    );
    const titleInput = screen.getByTestId("title");
    const muscleGroupSelect = screen.getByTestId("muscle_group");
    const repsInput = screen.getByTestId("reps");
    const loadInput = screen.getByTestId("load");
    const closeForm = screen.getByText("close");
    const submit = screen.getByText(/add/i);
    expect(titleInput).toBeInTheDocument();
    expect(muscleGroupSelect).toBeInTheDocument();
    expect(repsInput).toBeInTheDocument();
    expect(loadInput).toBeInTheDocument();
    expect(submit).toBeInTheDocument();
    expect(closeForm).toBeInTheDocument();
  });

  it("should focus input fields in the right order", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <WorkoutForm />
      </Provider>
    );
    const titleInput = screen.getByTestId("title");
    const muscleGroupSelect = screen.getByTestId("muscle_group");
    const repsInput = screen.getByTestId("reps");
    const loadInput = screen.getByTestId("load");
    const closeForm = screen.getByText("close");
    const submit = screen.getByText(/add/i);
    await user.tab();
    expect(closeForm).toHaveFocus();
    await user.tab();
    expect(titleInput).toHaveFocus();
    await user.tab();
    expect(muscleGroupSelect).toHaveFocus();
    await user.tab();
    expect(repsInput).toHaveFocus();
    await user.tab();
    expect(loadInput).toHaveFocus();
    await user.tab();
    expect(submit).toHaveFocus();
  });

  it("should update input/select value when user types/selects", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <WorkoutForm />
      </Provider>
    );
    const titleInput = screen.getByTestId("title");
    const muscleGroupSelect = screen.getByTestId("muscle_group");
    const repsInput = screen.getByTestId("reps");
    const loadInput = screen.getByTestId("load");
    await user.type(titleInput, "squats");
    await user.selectOptions(muscleGroupSelect, "leg");
    await user.type(repsInput, "30");
    await user.type(loadInput, "22");
    expect(titleInput).toHaveValue("squats");
    expect(muscleGroupSelect).toHaveValue("leg");
    expect(repsInput).toHaveValue(30);
    expect(loadInput).toHaveValue(22);
  });

  it("should signal input error when input value(s) are missing", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <WorkoutForm />
      </Provider>
    );
    let titleInput = screen.getByTestId("title");
    let muscleGroupSelect = screen.getByTestId("muscle_group");
    let repsInput = screen.getByTestId("reps");
    let loadInput = screen.getByTestId("load");
    let submit = screen.getByText(/add/i);
    await user.type(titleInput, "squats");
    await user.selectOptions(muscleGroupSelect, "");
    await user.type(repsInput, " ");
    await user.type(loadInput, "22");
    await user.click(submit);
    titleInput = await screen.findByTestId("title");
    muscleGroupSelect = await screen.findByTestId("muscle_group");
    repsInput = await screen.findByTestId("reps");
    loadInput = await screen.findByTestId("load");
    expect(titleInput).not.toHaveAttribute("class", "error");
    expect(muscleGroupSelect).toHaveAttribute("class", "error");
    expect(repsInput).toHaveAttribute("class", "error");
    expect(loadInput).not.toHaveAttribute("class", "error");
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error.textContent).toMatch(/please fill out the empty fields/i);
    expect(error).toHaveAttribute("class", "error flashMessage");
  });

  it("should signal input error when title is too long", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <WorkoutForm />
      </Provider>
    );
    let titleInput = screen.getByTestId("title");
    const muscleGroupSelect = screen.getByTestId("muscle_group");
    const repsInput = screen.getByTestId("reps");
    const loadInput = screen.getByTestId("load");
    const submit = screen.getByText(/add/i);
    await user.type(
      titleInput,
      "adasdaasdsdfsdfdddfdfsdfsfsdfsfddsfsfsfsdfterttrtee"
    );
    await user.selectOptions(muscleGroupSelect, "biceps");
    await user.type(repsInput, "22");
    await user.type(loadInput, "22");
    await user.click(submit);
    titleInput = await screen.findByTestId("title");
    expect(titleInput).toHaveAttribute("class", "error");
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument()
    expect(error.textContent).toMatch(/max 30 characters/i);
    expect(error).toHaveAttribute("class", "error flashMessage");
  });

  it("should signal input error if title contains non-alphabetic characters", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <WorkoutForm />
      </Provider>
    );
    let titleInput = screen.getByTestId("title");
    const muscleGroupSelect = screen.getByTestId("muscle_group");
    const repsInput = screen.getByTestId("reps");
    const loadInput = screen.getByTestId("load");
    const submit = screen.getByText(/add/i);
    await user.type(titleInput, "66768^&^*&%<>*");
    await user.selectOptions(muscleGroupSelect, "biceps");
    await user.type(repsInput, "22");
    await user.type(loadInput, "22");
    await user.click(submit);
    titleInput = await screen.findByTestId("title");
    expect(titleInput).toHaveAttribute("class", "error");
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error.textContent).toMatch(/may contain only letters/i);
    expect(error).toHaveAttribute("class", "error flashMessage");
  });

  it("should signal input error if reps value is too large", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <WorkoutForm />
      </Provider>
    );
    const titleInput = screen.getByTestId("title");
    const muscleGroupSelect = screen.getByTestId("muscle_group");
    let repsInput = screen.getByTestId("reps");
    const loadInput = screen.getByTestId("load");
    const submit = screen.getByText(/add/i);
    await user.type(titleInput, "arm curls");
    await user.selectOptions(muscleGroupSelect, "biceps");
    await user.type(repsInput, "23848394829");
    await user.type(loadInput, "22");
    await user.click(submit);
    repsInput = await screen.findByTestId("reps");
    expect(repsInput).toHaveAttribute("class", "error");
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error.textContent).toMatch(/reps value too large/i);
    expect(error).toHaveAttribute("class", "error flashMessage");
  });

  it("should signal input error when load value is too large", async () => {
    server.use(
      http.post(
        `${import.meta.env.VITE_API}/api/workouts`,
        () => {
          return new HttpResponse.json({
            error: "Load value too large",
          }, { status: 400 })
        }
      )
    );
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <WorkoutForm />
      </Provider>
    );
    const titleInput = screen.getByTestId("title");
    const muscleGroupSelect = screen.getByTestId("muscle_group");
    const repsInput = screen.getByTestId("reps");
    let loadInput = screen.getByTestId("load");
    const submit = screen.getByText(/add/i);
    await user.type(titleInput, "arm curls");
    await user.selectOptions(muscleGroupSelect, "biceps");
    await user.type(repsInput, "22");
    await user.type(loadInput, "284738378");
    await user.click(submit);
    loadInput = await screen.findByTestId("load");
    expect(loadInput).toHaveAttribute("class", "error");
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error.textContent).toMatch(/load value too large/i);
    expect(error).toHaveAttribute("class", "error flashMessage");
  });

  it("should respond with error if user is not authorized", async () => {
    // TODO: runtime interception not working
    server.use(
      http.post(
        `${import.meta.env.VITE_API}/api/workouts`,
        () => {
          return new HttpResponse.json({
            error: "Not authorized",
          }, { status: 401 })
        }
      )
    );
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <WorkoutForm />
      </Provider>
    );
    const titleInput = screen.getByTestId("title");
    const muscleGroupSelect = screen.getByTestId("muscle_group");
    const repsInput = screen.getByTestId("reps");
    const loadInput = screen.getByTestId("load");
    const submit = screen.getByText(/add/i);
    await user.type(titleInput, "arm curls");
    await user.selectOptions(muscleGroupSelect, "biceps");
    await user.type(repsInput, "33");
    await user.type(loadInput, "20");
    await user.click(submit);
    const error = await screen.findByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error.textContent).toMatch(/not authorized/i);
    expect(error).toHaveAttribute("class", "error flashMessage");
  });

  it("should respond with success if input is valid and user authorized", async () => {
    user.setup();
    render(
      <Provider store={store}>
        <App />
        <WorkoutForm />
      </Provider>
    );
    const titleInput = screen.getByTestId("title");
    const muscleGroupSelect = screen.getByTestId("muscle_group");
    const repsInput = screen.getByTestId("reps");
    const loadInput = screen.getByTestId("load");
    const submit = screen.getByText(/add/i);
    await user.type(titleInput, "arm curls");
    await user.selectOptions(muscleGroupSelect, "biceps");
    await user.type(repsInput, "33");
    await user.type(loadInput, "20");
    await user.click(submit);
    const success = await screen.findByRole("alert");
    expect(success).toBeInTheDocument();
    expect(success.textContent).toMatch(/successfully created workout/i);
    expect(success).toHaveAttribute("class", "success flashMessage");
  });
});
