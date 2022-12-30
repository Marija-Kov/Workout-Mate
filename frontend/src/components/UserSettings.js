import React from 'react'
import { useUpdateUser } from '../hooks/useUpdateUser';

export default function UserSettings({closeUserSettings, showNewProfileImg}) {
    const {updateUser, isLoading, error} = useUpdateUser();
    const [fileInputState, setFileInputState] = React.useState();
    const [selectedFile, setSelectedFile] = React.useState(); 

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

   const handleUpdateProfile = async (e) => {
     e.preventDefault();
     if (!selectedFile) return;
     await updateUser(selectedFile);
   }

  return (
    <div className="form--container">
      <form className="user--settings" onSubmit={handleUpdateProfile}>
        <span
          className="close--user--settings material-symbols-outlined"
          onClick={() => closeUserSettings()}
        >
          close{" "}
        </span>
        <h4>Profile settings</h4>
        <label>Change profile image</label>
        <input
          type="file"
          name="profile-image"
          value={fileInputState}
          onChange={handleFileInputChange}
        />
        {selectedFile && (
          <img
            src={selectedFile}
            style={{ height: "100px" }}
            alt="the chosen file"
          ></img>
        )}
        <button disabled={isLoading} className="upload--btn">
          Upload
        </button>
        {error && <div className="error">{error}</div>}
       {isLoading && <h3 style={{zIndex:"10"}}>Uploading..</h3>} 
      </form>
      
    </div>
  );
}
