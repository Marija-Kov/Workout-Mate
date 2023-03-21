import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import user from "@testing-library/user-event";
import Navbar from "../Navbar";
import { server } from "../../mocks/server";
import { AuthContextProvider } from "../../context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { WorkoutContextProvider } from "../../context/WorkoutContext";

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => {
    global.Storage.prototype.setItem.mockReset();
    global.Storage.prototype.getItem.mockReset();
    server.close()
});

describe("<Navbar />", ()=>{
    it("should render the navbar correctly when the user is not logged in", () => {
            render(
              <AuthContextProvider>
                <BrowserRouter>
                  <Navbar />
                </BrowserRouter>
              </AuthContextProvider>
            );
     const aboutLink = screen.getByLabelText(/about/i);
     const loginLink = screen.getByLabelText(/login/i);
     const signupLink = screen.getByLabelText(/signup/i);
     expect(aboutLink).toBeInTheDocument();
     expect(signupLink).toBeInTheDocument();
     expect(loginLink).toBeInTheDocument();
    });

    it("should focus navbar elements in the right order", async () => {
     user.setup();
        render(
       <AuthContextProvider>
         <BrowserRouter>
           <Navbar />
         </BrowserRouter>
       </AuthContextProvider>
     );
     const aboutLink = screen.getByLabelText(/about/i);
     const loginLink = screen.getByLabelText(/login/i);
     const signupLink = screen.getByLabelText(/signup/i);
     await user.tab();
     await user.tab();
     expect(aboutLink).toHaveFocus();
     await user.tab();
     expect(loginLink).toHaveFocus();
     await user.tab();
     expect(signupLink).toHaveFocus();
    });

    it("should render the navbar correctly when the user is logged in as well as focus the elements in the right order", async () =>{
       user.setup();
       const mockLocalStorage = {};
       const storageUser = {
         id: "userId",
         email: "keech@mail.yu",
         token: "authorizationToken",
       };
       global.Storage.prototype.setItem = jest.fn((key, value) => {
         mockLocalStorage[key] = value;
       });
       global.Storage.prototype.getItem = jest.fn((key) => mockLocalStorage[key]);
       localStorage.setItem("user", JSON.stringify(storageUser))
            render(
              <AuthContextProvider>
                <BrowserRouter> 
                  <Navbar />
                </BrowserRouter>
              </AuthContextProvider>
            );
       const helloUser = screen.getByLabelText(/user menu/i);
       await user.tab();
       await user.tab();
       expect(helloUser).toBeInTheDocument();
       expect(helloUser).toHaveFocus();
    });

    it("should render the user menu once the user clicks on the avatar/", async () => {
      const mockLocalStorage = {};
       const storageUser = {
         id: "userId",
         email: "keech@mail.yu",
         token: "authorizationToken",
       };
       global.Storage.prototype.setItem = jest.fn((key, value) => {
         mockLocalStorage[key] = value;
       });
       global.Storage.prototype.getItem = jest.fn((key) => mockLocalStorage[key]);
       localStorage.setItem("user", JSON.stringify(storageUser));
              render(
                 <WorkoutContextProvider>
                  <AuthContextProvider>
                    <BrowserRouter>
                      <Navbar />
                    </BrowserRouter>
                  </AuthContextProvider>
                 </WorkoutContextProvider>
              );
       user.setup();
       const helloUser = screen.getByLabelText(/user menu/i);
       user.click(helloUser);
       const userSettings = await screen.findByLabelText(/settings/i);
       const logOut = await screen.findByLabelText(/log out/i);
       expect(userSettings).toBeInTheDocument();
       expect(logOut).toBeInTheDocument();
    });
})