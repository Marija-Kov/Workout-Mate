import React from 'react'

export default function UserSettings({closeUserSettings}) {
    const [file, setFile] = React.useState(null);

    const handleFileSelect = (e) => {
        setFile(e.target.files[0]);
      }
    const updateProfile = (e) => {
        e.preventDefault()
        console.log(file)
    }

  return (
    <div className="form--container">
      <form className="user--settings" onSubmit={updateProfile}>
        <span
          className="close--user--settings material-symbols-outlined"
          onClick={() => closeUserSettings()}>
            close </span>
        <h4>Profile settings</h4>
          <label>Change profile image</label>
          <input type="file" onChange={handleFileSelect}></input>
          <button className="upload--btn">Upload</button>
       
      </form>
    </div>
  );
}
