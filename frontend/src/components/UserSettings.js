import React from 'react'
import { useUpdateUser } from '../hooks/useUpdateUser';
import Cropper from "react-easy-crop";
import { useCroppedImg } from '../hooks/useCroppedImg';
import { useDeleteUser } from "../hooks/useDeleteUser";
import { useDeleteAllWorkouts } from "../hooks/useDeleteAllWorkouts";
import { useLogout } from "../hooks/useLogout";
import { useSelector } from 'react-redux';


export default function UserSettings({closeUserSettings, changeProfileImg}) {
    const { updateUser } = useUpdateUser();
    const { getCroppedImg } = useCroppedImg();
    const { deleteUser } = useDeleteUser();
    const { deleteAllWorkouts } = useDeleteAllWorkouts();
    const { logout } = useLogout();
    const { user, loading, updateUserError, success } =  useSelector(state => state.user)

    const [newUsername, setNewUsername] = React.useState('');

    const [fileInputState, setFileInputState] = React.useState();
    const [selectedFile, setSelectedFile] = React.useState(); 

    const [crop, setCrop] = React.useState({ x: 0, y: 0 });
    const [zoom, setZoom] = React.useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = React.useState(null);
    
    const [deleteAccountDialogue, setDeleteAccountDialogue] =
      React.useState(false);

    const handleFileInputChange = (e) => {
        const file = e.target.files[0]
        previewFile(file) 
      }

   const previewFile = (file) => {
     const reader = new FileReader();
     reader.readAsDataURL(file);
     reader.onloadend = () => {
      setSelectedFile(reader.result); // reader.result --> base64EncodedImage
     }
   }

   const onCropComplete = React.useCallback((croppedArea, croppedAreaPixels) => { // must have something before croppedAreaPixels
     setCroppedAreaPixels(croppedAreaPixels);
   }, []);

   const readyToUpdateProfile = React.useCallback(async () => {
    let croppedImage = undefined;
    let username = newUsername ? newUsername : null;
     try {
      if(selectedFile){
       croppedImage = await getCroppedImg(selectedFile, croppedAreaPixels);
       changeProfileImg(croppedImage)
      }
      await updateUser(username, croppedImage)      
     } catch (err) {
       console.error(err);
     }
   }, [newUsername, selectedFile, croppedAreaPixels, changeProfileImg, getCroppedImg, updateUser]);

   const handleUpdateProfile = async (e) => {
     e.preventDefault();
     await readyToUpdateProfile();
   };

   const deleteAccount = async () => {
     await deleteAllWorkouts();
     await deleteUser(user.id);
     logout();
   };

   const showDeleteAccount = () => {
     setDeleteAccountDialogue((prev) => !prev);
   };

  return (
    <>
    <div className="form--container--user--settings">
      <form aria-label="change user settings" className="user--settings" onSubmit={handleUpdateProfile}>
        <button
          aria-label="close form"
          className="close material-symbols-outlined"
          onClick={closeUserSettings}
        >
          close
        </button>
        <h4>Profile settings</h4>
        <label>Change displayed name:</label>
        <input
          className={newUsername.length > 12 ? "error" : ""}
          type="text"
          name="username"
          id="new-username"
          aria-label="new username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        {newUsername.length > 12 && <p className="max-chars-error" role="alert">⚠Too long name!</p>}
        <label>Change profile image:</label>
        <input
          type="file"
          name="profile-image"
          id="new-profile-image"
          aria-label="new profile image"
          value={fileInputState}
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
        <button aria-label="update profile button" disabled={loading || newUsername.length > 12} className={newUsername.length > 12 ? "disabled--btn upload--btn" : "upload--btn"}>
          Upload
        </button>
        {updateUserError && <div role="alert" className="error">{updateUserError}</div>}
        {success && <div role="alert" className="success">{success}</div>}
        {loading && <h3 style={{ zIndex: "10" }}>Uploading..</h3>}
        <button aria-label="delete account button" type="button" className="delete--account--btn" onClick={showDeleteAccount}>
          delete account
        </button>
      </form>
       {deleteAccountDialogue && (
        <div className="delete--account--dialogue" aria-label="delete account dialogue">
          <h4>This is irreversible.</h4>
          <p>We won't be able to recover any of your data.</p>
          <p>Are you sure you want to proceed?</p>
          <div className="delete--account--dialogue--btns">
            <button aria-label="confirm account deletion" type="button" onClick={deleteAccount}>
              Yes, delete my account permanently 💀
            </button>
            <button aria-label="keep account and close dialogue" type="button" onClick={showDeleteAccount}>
              No, I changed my mind
            </button>
          </div>
        </div>
      )}
    </div>
         
      </>
  );
}
