import React, { useState } from "react";

const ImageUploader: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages((prev) => [...prev, ...filesArray]);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 rounded-lg w-full">
      <span className="font-medium mb-8">عکس‌های مورد نظرت رو آپلود کن:</span>
      <div
        className={`flex flex-col-3 max-w-[406px] max-h-[258px] gap-4 flex-wrap overflow-y-auto justify-center`}>
        <label className="w-28 h-28 rounded-2xl flex justify-center items-center cursor-pointer hover:bg-orange-50 transition">
          <div
            className={`uploader w-[111px] h-[80px] flex items-center justify-end bg-cover bg-center bg-no-repeat ${
              images.length === 0 ? "self-center" : "self-start"
            }`}
          />
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
        </label>
        {images.map((src, index) => (
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

export default ImageUploader;
