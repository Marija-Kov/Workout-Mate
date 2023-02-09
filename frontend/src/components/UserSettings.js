import React from 'react'
import { useUpdateUser } from '../hooks/useUpdateUser';
import Cropper from "react-easy-crop";
import { useCroppedImg } from '../hooks/useCroppedImg';

export default function UserSettings({closeUserSettings, changeProfileImg}) {
    const {updateUser, isLoading, error, success} = useUpdateUser();
    const { getCroppedImg } = useCroppedImg();

    const [newUsername, setNewUsername] = React.useState('');

    const [fileInputState, setFileInputState] = React.useState();
    const [selectedFile, setSelectedFile] = React.useState(); 

    const [crop, setCrop] = React.useState({ x: 0, y: 0 });
    const [zoom, setZoom] = React.useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = React.useState(null);
    
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
     await readyToUpdateProfile()   
   }

  return (
    <div className="form--container">
      <form className="user--settings" onSubmit={handleUpdateProfile}>
        <span
          className="close--user--settings material-symbols-outlined"
          onClick={() => closeUserSettings()}
        >
          close
        </span>
        <h4>Profile settings</h4>
        <label>Change displayed name:</label>
        <input
          type="text"
          name="username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <label>Change profile image:</label>
        <input
          type="file"
          name="profile-image"
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
        <button disabled={isLoading} className="upload--btn">
          Upload
        </button>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        {isLoading && <h3 style={{ zIndex: "10" }}>Uploading..</h3>}
      </form>
    </div>
  );
}
