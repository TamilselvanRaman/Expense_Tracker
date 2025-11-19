import React, { useRef, useState, useEffect } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

function ProfilePhotoSelector({ image, setImage }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  // Generate preview when image changes
  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    // Clean up
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const onChooseImage = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div
          onClick={onChooseImage}
          className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center cursor-pointer relative"
        >
          <LuUser size={30} className="text-4xl text-primary" />
          <button
            type="button"  
            className="absolute w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full -bottom-1 -right-1 cursor-pointer"
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Profile Preview"
            className="w-20 h-20 rounded-full object-cover"
          />
          <button
            type="button"  
            onClick={handleRemoveImage}
            className="absolute w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full -bottom-1 -right-1 cursor-pointer"
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfilePhotoSelector;
