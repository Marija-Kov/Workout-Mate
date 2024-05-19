import { useState } from "react";
import { useUpdateUser } from "../hooks/useUpdateUser";
import Cropper from "react-easy-crop";
import { useCroppedImg } from "../hooks/useCroppedImg";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { useDownloadData } from "../hooks/useDownloadData";
import { useDeleteAllWorkouts } from "../hooks/useDeleteAllWorkouts";
import { useLogout } from "../hooks/useLogout";
import { useDispatch, useSelector } from "react-redux";

export default function UserSettings({ changeProfileImg }) {
  const dispatch = useDispatch();
  const { downloadData } = useDownloadData();
  const { updateUser } = useUpdateUser();
  const { croppedImg } = useCroppedImg();
  const { deleteUser } = useDeleteUser();
  const { deleteAllWorkouts } = useDeleteAllWorkouts();
  const { logout } = useLogout();
  const loading = useSelector((state) => state.loader);
  const { isDeleteAccountDialogueMounted } = useSelector(
    (state) => state.toggleMountComponents
  );
  const [newUsername, setNewUsername] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
  };

  const previewFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setSelectedFile(reader.result);
    };
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    let croppedImage = undefined;
    let username = newUsername ? newUsername : null;
    if (selectedFile) {
      croppedImage = await croppedImg(selectedFile, croppedAreaPixels);
      changeProfileImg(croppedImage);
    }
    await updateUser(username, croppedImage);
  };

  const toggleDisableUploadBtn = () => {
    if (loading) return true;
    if (newUsername && !newUsername.match(/^[a-zA-Z0-9._]+$/)) return true;
    if (!newUsername && !selectedFile) return true;
    if (newUsername && !newUsername.trim() && !selectedFile) return true;
    if (newUsername.trim().length > 12) return true;
    return false;
  };

  const uploadBtnStyle = () => {
    if (loading) return "disabled--btn upload--btn";
    if (newUsername && !newUsername.match(/^[a-zA-Z0-9._]+$/))
      return "disabled--btn upload--btn";
    if (!newUsername && !selectedFile) return "disabled--btn upload--btn";
    if (newUsername && !newUsername.trim() && !selectedFile)
      return "disabled--btn upload--btn";
    if (newUsername.trim().length > 12) return "disabled--btn upload--btn";
    return "upload--btn";
  };

  const deleteAccount = async () => {
    await deleteAllWorkouts();
    await deleteUser();
    await logout();
  };

  const runDownloadData = async (e) => {
    e.preventDefault();
    await downloadData();
  };

  return (
    <div className="form--container--user--settings">
      <form className="user--settings" onSubmit={handleUpdateProfile}>
        <button
          className="close material-symbols-outlined"
          onClick={() => {
            dispatch({ type: "TOGGLE_MOUNT_USER_SETTINGS_FORM" });
          }}
        >
          close
        </button>
        <h4>Profile settings</h4>
        <label htmlFor="username">Change username:</label>
        <input
          className={newUsername.trim().length > 12 ? "error" : ""}
          type="text"
          name="username"
          id="username"
          data-testid="username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value.trim())}
        />
        {newUsername.trim().length > 12 && (
          <p className="max-chars-error" role="alert">
            ⚠Too long name!
          </p>
        )}
        {newUsername.trim() && !newUsername.match(/^[a-zA-Z0-9._]+$/) && (
          <p className="max-chars-error" role="alert">
            ⚠Letters, numbers, '_' and '.' allowed!
          </p>
        )}
        <label htmlFor="profile-image">Change profile image:</label>
        <input
          type="file"
          accept=".jpg, .png, .svg"
          name="profile-image"
          id="profile-image"
          data-testid="profile-image"
          onChange={handleFileInputChange}
        />
        {selectedFile && (
          <div className="cropper--wrapper">
            <Cropper
              className="cropper"
              image={selectedFile}
              crop={crop}
              zoom={zoom}
              zoomWithScroll={true}
              showGrid={true}
              aspect={1 / 1}
              cropShape="round"
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
        )}
        <button
          className={uploadBtnStyle()}
          disabled={toggleDisableUploadBtn()}
        >
          Upload
        </button>
        {loading && (
          <h4 style={{ position: "absolute", zIndex: "10" }}>Loading...</h4>
        )}
        <button className="download--data--btn" onClick={runDownloadData}>
          download data
        </button>
        <button
          type="button"
          className="delete--account--btn"
          onClick={() =>
            dispatch({ type: "TOGGLE_MOUNT_DELETE_ACCOUNT_DIALOGUE" })
          }
        >
          delete account
        </button>
      </form>
      {isDeleteAccountDialogueMounted && (
        <div className="delete--account--dialogue">
          <h4>This is irreversible.</h4>
          <p>We won't be able to recover any of your data.</p>
          <p>Are you sure you want to proceed?</p>
          <div className="delete--account--dialogue--btns">
            <button type="button" onClick={deleteAccount}>
              Yes, delete my account permanently 💀
            </button>
            <button
              type="button"
              onClick={() =>
                dispatch({ type: "TOGGLE_MOUNT_DELETE_ACCOUNT_DIALOGUE" })
              }
            >
              No, I changed my mind
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
