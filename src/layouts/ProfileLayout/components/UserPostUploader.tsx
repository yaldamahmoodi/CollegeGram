import Button from "@/components/Button";
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
        className={`flex flex-col-3 max-w-[340px] max-h-[258px] gap-4 flex-wrap ${
          images.length === 0 ? "justify-center" : "justify-start"
        }`}>
        <label className="w-28 h-28 rounded-2xl flex justify-center items-center cursor-pointer hover:bg-orange-50 transition">
          <div className="uploader w-[111px] h-[80px] flex items-center justify-end bg-cover bg-center bg-no-repeat" />
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

      <div className="flex justify-end w-full mt-4 gap-4">
        <a className="text-gray-700 cursor-pointer">پشیمون شدم</a>
        <Button label="بعدی" variant="danger" />
      </div>
    </div>
  );
};

export default ImageUploader;
