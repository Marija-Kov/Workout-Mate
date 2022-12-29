import React from 'react'
import { useAuthContext } from "../hooks/useAuthContext";

export default function UserSettings({closeUserSettings, changeProfileImg}) {
    const { user } = useAuthContext();
    const [error, setError] = React.useState(null);
    const [fileInputState, setFileInputState] = React.useState();
    const [selectedFile, setSelectedFile] = React.useState(); 
    const [previewSource, setPreviewSource] = React.useState(); 

    const handleFileInputChange = (e) => {
        const file = e.target.files[0]
        previewFile(file)
      }

   const previewFile = (file) => {
     const reader = new FileReader();
     reader.readAsDataURL(file);
     reader.onloadend = () => {
      setPreviewSource(reader.result)
      setSelectedFile(true)
     }
   }

   const handleUpdateProfile = (e) => {
    e.preventDefault();
    if(!selectedFile) return;
    uploadImage(previewSource);
   }

   const uploadImage = async (base64EncodedImage) => {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          profileImg: base64EncodedImage,
        }),
        headers: {'Content-type': 'application/json'}
      });

   const json = await response.json();

   if (!response.ok) {
     setError(json.error);
   }
    if (response.ok) {
      changeProfileImg(json.profileImg)
      console.log(json);
      setError(null);
    }
   }

  return (
    <div className="form--container">
      <form className="user--settings" onSubmit={handleUpdateProfile}>
        <span
          className="close--user--settings material-symbols-outlined"
          onClick={() => closeUserSettings()}>
            close </span>
        <h4>Profile settings</h4>
          <label>Change profile image</label>
          <input 
          type="file" 
          name="profile-image" 
          value={fileInputState} 
          onChange={handleFileInputChange} />
        {previewSource && <img src={previewSource} style={{height: "100px"}} alt="the chosen file"></img>}     
          <button className="upload--btn">Upload</button>
        
      </form>
     
    </div>
  );
}
