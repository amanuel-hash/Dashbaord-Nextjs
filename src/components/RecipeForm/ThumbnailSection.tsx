/* eslint-disable @next/next/no-img-element */
const ThumbnailSection = ({ form, handleFileUpload, mode }: any) => (
  <div>
    <h3 className="mb-2 text-lg font-semibold text-green-600">Thumbnail Image</h3>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => handleFileUpload("thumbnailImage", e.target.files)}
      className="my-1 w-full border bg-white px-3 py-2"
    />
    {mode === "edit" && form.thumbnailImage && (
      <div className="flex ">
        <img
          src={
            typeof form.thumbnailImage === "string"
              ? form.thumbnailImage
              : URL.createObjectURL(form.thumbnailImage)
          }
          alt="Thumbnail"
          className="h-32 w-48 rounded border object-cover"
        />
      </div>
    )}
  </div>
);

export default ThumbnailSection;