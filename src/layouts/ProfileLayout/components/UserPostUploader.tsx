import React, { useState, useEffect } from "react";

interface Props {
  images: File[];
  onChange: (files: File[]) => void;
}

const UserPostUploader = ({ images, onChange }: Props) => {
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const newPreviews = images.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const validFiles = filesArray.filter((file) =>
        ["image/jpeg", "image/jpg", "image/png"].includes(file.type)
      );

      if (validFiles.length !== filesArray.length) {
        alert("فقط فایل‌های JPG, JPEG و PNG مجاز هستند.");
      }

      onChange([...images, ...validFiles]);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 rounded-lg w-full mt-8">
      <span className="font-medium mb-8">عکس‌های مورد نظرت رو آپلود کن:</span>
      <div className="flex flex-col-3 max-w-[406px] max-h-[258px] gap-4 flex-wrap overflow-y-auto justify-center">
        <label className="w-28 h-28 rounded-2xl flex justify-center items-center cursor-pointer hover:bg-orange-50 transition">
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
          <div
            className={`uploader w-[121px] h-[100px] flex items-center justify-end bg-cover bg-center bg-no-repeat ${
              previews.length === 0 ? "self-center" : "self-start"
            }`}
          />
        </label>
        {previews.map((src, index) => (
          <div
            key={index}
            className="relative w-[104px] h-[104px] border border-gray-200 rounded-3xl overflow-hidden">
            <img
              src={src}
              alt={`uploaded-${index}`}
              className="w-full h-full object-cover "
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute text-lg top-1 left-1  w-[24px] h-[24px] bg-orange-500 text-white rounded-full hover:bg-orange-600">
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPostUploader;
