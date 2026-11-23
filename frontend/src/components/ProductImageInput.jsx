import { useState } from "react";
import { ImageIcon, UploadIcon, XIcon } from "lucide-react";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

function ProductImageInput({ value = "", onChange, onReadingChange }) {
  const [imageError, setImageError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const image = typeof value === "string" ? value : "";

  const setImageFromFile = (file) => {
    setImageError("");
    if (!file || isReading) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Choose a JPG, PNG, WEBP, or GIF image.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("The image must be smaller than 4 MB.");
      return;
    }

    const reader = new FileReader();
    setIsReading(true);
    onReadingChange?.(true);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      } else {
        setImageError("Could not read this image. Please try another file.");
      }
      setIsReading(false);
      onReadingChange?.(false);
    };
    reader.onerror = () => {
      setImageError("Could not read this image. Please try another file.");
      setIsReading(false);
      onReadingChange?.(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="form-control gap-3">
      <label
        className={`flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-box border-2 border-dashed p-4 text-center transition-colors ${
          isDragging
            ? "border-primary bg-primary/10"
            : "border-base-content/20 hover:border-primary"
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          setImageFromFile(event.dataTransfer.files[0]);
        }}
      >
        <input
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          className="sr-only"
          disabled={isReading}
          onChange={(event) => {
            setImageFromFile(event.target.files[0]);
            event.target.value = "";
          }}
        />
        {image ? (
          <img
            src={image}
            alt="Product preview"
            className="h-24 max-w-full rounded-lg object-contain"
          />
        ) : (
          <UploadIcon className="size-8 text-primary" />
        )}
        <span className="font-medium">
          {isReading
            ? "Reading image..."
            : image
              ? "Image selected - drop another or browse"
              : "Drop an image here or click to browse"}
        </span>
        <span className="text-sm text-base-content/60">JPG, PNG, WEBP, or GIF (max 4 MB)</span>
      </label>

      <label className="label">
        <span className="label-text text-base font-medium">Or use an image URL</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/50">
          <ImageIcon className="size-5" />
        </div>
        <input
          type="text"
          placeholder="https://example.com/image.jpg"
          className="input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200"
          value={image.startsWith("data:image/") ? "" : image}
          disabled={isReading}
          onChange={(event) => {
            setImageError("");
            onChange(event.target.value);
          }}
        />
      </div>
      {image && (
        <button
          type="button"
          className="btn btn-ghost btn-sm self-start"
          disabled={isReading}
          onClick={() => {
            onChange("");
            setImageError("");
          }}
        >
          <XIcon className="size-4" />
          Remove image
        </button>
      )}
      {imageError && <p className="text-sm text-error">{imageError}</p>}
      {isReading && <span className="loading loading-spinner loading-sm self-start" aria-label="Reading image" />}
    </div>
  );
}

export default ProductImageInput;
