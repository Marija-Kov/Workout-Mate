import UserSettings from "../UserSettings";
import user from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { WorkoutContextProvider } from "../../context/WorkoutContext";
import { AuthContextProvider } from "../../context/AuthContext";

describe("<UserSettings/>", () => {
    it("should render UserSettings component correctly", async () => {
      render(
        <AuthContextProvider>
          <WorkoutContextProvider>
            <UserSettings />
          </WorkoutContextProvider>
        </AuthContextProvider>
      );
      const userSettings = await screen.findByLabelText(/user settings/i);
      const closeForm = await screen.findByLabelText(/close form/i);
      const newUsername = await screen.findByLabelText(/new username/i);
      const newProfileImage = await screen.findByLabelText(/new profile image/i);
      const upload = await screen.findByLabelText(/update profile button/i);
      const deleteAccount = await screen.findByLabelText(/delete account button/i);
      expect(userSettings).toBeInTheDocument();
      expect(closeForm).toBeInTheDocument();
      expect(newUsername).toBeInTheDocument();
      expect(newProfileImage).toBeInTheDocument();
      expect(upload).toBeInTheDocument();
      expect(deleteAccount).toBeInTheDocument();
    });

    it("should focus elements in correct order", async () => {
      user.setup();
      render(
        <AuthContextProvider>
          <WorkoutContextProvider>
            <UserSettings />
          </WorkoutContextProvider>
        </AuthContextProvider>
      );
      const closeForm = await screen.findByLabelText(/close form/i);
      const newUsername = await screen.findByLabelText(/new username/i);
      const newProfileImage = await screen.findByLabelText(/new profile image/i);
      const upload = await screen.findByLabelText(/update profile button/i);
      const deleteAccount = await screen.findByLabelText(/delete account button/i);
      await user.tab();
      expect(closeForm).toHaveFocus();
      await user.tab();
      expect(newUsername).toHaveFocus();
      await user.tab();
      expect(newProfileImage).toHaveFocus();
      await user.tab();
      expect(upload).toHaveFocus();
      await user.tab();
      expect(deleteAccount).toHaveFocus();
    });

    it("should update new username input value when user types", async () => {
      user.setup();
      render(
        <AuthContextProvider>
          <WorkoutContextProvider>
            <UserSettings />
          </WorkoutContextProvider>
        </AuthContextProvider>
      );
      const newUsername = await screen.findByLabelText(/new username/i);
      await user.type(newUsername, "daredev");
      expect(newUsername).toHaveValue("daredev");
    });

    it("should render error message and disable upload button if name is too long", async () => {
      user.setup();
      render(
        <AuthContextProvider>
          <WorkoutContextProvider>
            <UserSettings />
          </WorkoutContextProvider>
        </AuthContextProvider>
      );
      const newUsername = await screen.findByLabelText(/new username/i);
      await user.type(newUsername, "daredev3343554543543553454");
      const error = await screen.findByRole('alert');
      const upload = await screen.findByLabelText(/update profile button/i);
      expect(error).toBeInTheDocument();
      expect(upload).toHaveAttribute("disabled");
      
    });

    it("should respond with success message if profile was updated successfully", async () => {
      user.setup();
      render(
        <AuthContextProvider>
          <WorkoutContextProvider>
            <UserSettings />
          </WorkoutContextProvider>
        </AuthContextProvider>
      );
      const newUsername = await screen.findByLabelText(/new username/i);
      await user.type(newUsername, "daredev");
      const upload = await screen.findByLabelText(/update profile button/i);
      await user.click(upload);
      const successMessage = await screen.findByText(/success/i);
      // it runs into authorization issue here
      // throws a big fat error for attempting to read user.profileImg when user===null
      expect(successMessage).toBeInTheDocument();
    });

    it("should render delete account dialogue component when 'delete account' button is clicked", async () => {
      user.setup();
      render(
        <AuthContextProvider>
          <WorkoutContextProvider>
            <UserSettings />
          </WorkoutContextProvider>
        </AuthContextProvider>
      );
      const deleteAccount = await screen.findByLabelText(
        /delete account button/i
      );
      await user.click(deleteAccount);
      const deleteAccountDialogue = await screen.findByLabelText(
        /delete account dialogue/i
      );
      expect(deleteAccountDialogue).toBeInTheDocument();
    });

});