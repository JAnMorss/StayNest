'use client';

import { IoMdClose, IoMdImages } from "react-icons/io";

type ImageUploadProps = {
  onChange: (files: File[]) => void;
  value: File[];
  disabled?: boolean;
};

export default function ImageUpload({ onChange, value, disabled }: ImageUploadProps) {
  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.currentTarget.files ?? []);
    if (selectedFiles.length > 0) {
      onChange([...value, ...selectedFiles]);
    }
    event.currentTarget.value = "";
  };

  const removeFile = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="flex flex-col gap-4">
      <label
        htmlFor="listing-image-upload"
        className={`
          flex 
          cursor-pointer 
          flex-col 
          items-center 
          gap-3 
          rounded-md border-2 
          border-dashed 
          border-neutral-300
          p-20
          text-sm 
          text-neutral-600 
          transition 
          hover:border-neutral-500 
          ${disabled ? "pointer-events-none opacity-60" : ""}`}
      >
        <IoMdImages size={30} />
        <span className="font-semibold text-lg">
          Click to upload
        </span>
      </label>
      <input
        id="listing-image-upload"
        type="file"
        accept="image/*"
        multiple
        disabled={disabled}
        onChange={handleSelect}
        className="sr-only"
      />

      {value.length > 0 && (
        <ul className="flex flex-col divide-y divide-neutral-200">
          {value.map((file, index) => (
            <li key={`${file.name}-${file.lastModified}-${index}`} className="flex items-center justify-between gap-3 py-2">
              <span className="min-w-0 truncate text-sm text-neutral-700">{file.name}</span>
              <button
                type="button"
                disabled={disabled}
                onClick={() => removeFile(index)}
                aria-label={`Remove ${file.name}`}
                className="shrink-0 rounded p-1 text-neutral-500 hover:bg-neutral-100 hover:text-black disabled:opacity-50"
              >
                <IoMdClose size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}