const VideosSection = ({ form, handleFileUpload, mode }: any) => (
  <div>
    <h3 className="mb-2 text-lg font-semibold text-green-600">Videos (Max 3)</h3>
    <input
      type="file"
      accept="video/*"
      multiple
      onChange={(e) => handleFileUpload("videoUrls", e.target.files)}
      className="my-1 w-full border bg-white px-3 py-2"
    />
    {mode === "edit" && form.videoUrls.length > 0 && (
      <div className="mt-2 flex flex-wrap gap-2">
        {form.videoUrls.map((vid: any, idx: number) => {
          const src = typeof vid === "string" ? vid : URL.createObjectURL(vid);
          return (
            <video
              key={idx}
              src={src}
              controls
              className="h-32 w-48 rounded border object-cover"
            />
          );
        })}
      </div>
    )}
  </div>
);

export default VideosSection;