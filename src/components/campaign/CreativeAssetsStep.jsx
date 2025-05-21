"use client";

const CreativeAssetsStep = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleFileUpload,
  uploading,
  setUploading,
  handleRemovePhoto,
}) => {
  const renderPreview = (items, type) => {
    if (items.length === 0) return null;

    return (
      <div className="mt-3">
        <h4 className="text-sm font-medium text-gray-700 mb-1">
          Uploaded {type}:
        </h4>
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <div key={index} className="relative group">
              {type === "videos" ? (
                <video
                  src={item.url}
                  className="h-20 w-20 object-cover rounded"
                  controls
                />
              ) : (
                <img
                  src={item.url}
                  alt={`${type} preview`}
                  className="h-20 w-20 object-cover rounded"
                />
              )}
              <button
                type="button"
                onClick={() => handleRemovePhoto(type, index)}
                className="remove-button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Creative Assets
      </h2>

      <div>
        <label className="block mb-2 text-gray-700">Brand Logos</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            type="file"
            onChange={(e) => {
              handleFileUpload(e, "logos");
              setUploading((prev) => ({ ...prev, logo: true }));
            }}
            multiple
            accept="image/*"
            className="hidden"
            id="logo-upload"
          />
          <label
            htmlFor="logo-upload"
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="mt-2 block text-sm font-medium text-gray-700">
              {uploading.logo ? "Uploading..." : "Click to upload logo(s)"}
            </span>
            <span className="mt-1 text-xs text-gray-500">
              PNG, JPG, SVG up to 10MB
            </span>
          </label>
        </div>
        {touched.assets?.logos && errors.assets?.logos && (
          <p className="mt-1 text-sm text-red-600">{errors.assets?.logos}</p>
        )}
        {renderPreview(values.assets.logos, "logos")}
      </div>

      <div>
        <label className="block mb-2 text-gray-700">Product Photos</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            type="file"
            onChange={(e) => {
              handleFileUpload(e, "photos");
              setUploading((prev) => ({ ...prev, photos: true }));
            }}
            multiple
            accept="image/*"
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="mt-2 block text-sm font-medium text-gray-700">
              {uploading.photos ? "Uploading..." : "Click to upload photo(s)"}
            </span>
            <span className="mt-1 text-xs text-gray-500">
              PNG, JPG up to 10MB
            </span>
          </label>
        </div>
        {renderPreview(values.assets.photos, "photos")}
      </div>

      <div>
        <label className="block mb-2 text-gray-700">Product Videos</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            type="file"
            onChange={(e) => {
              handleFileUpload(e, "videos");
              setUploading((prev) => ({ ...prev, videos: true }));
            }}
            multiple
            accept="video/*"
            className="hidden"
            id="video-upload"
          />
          <label
            htmlFor="video-upload"
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="mt-2 block text-sm font-medium text-gray-700">
              {uploading.videos ? "Uploading..." : "Click to upload video(s)"}
            </span>
            <span className="mt-1 text-xs text-gray-500">
              MP4, MOV up to 50MB
            </span>
          </label>
        </div>
        {renderPreview(values.assets.videos, "videos")}
      </div>

      <div>
        <label className="block mb-2 text-gray-700">
          Brand Style Guide (Optional)
        </label>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700">Fonts</label>
            <textarea
              name="assets.styleGuide.fonts"
              value={values.assets.styleGuide.fonts}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              rows={2}
              placeholder="Primary font: Montserrat, Secondary font: Open Sans"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">Colors</label>
            <textarea
              name="assets.styleGuide.colors"
              value={values.assets.styleGuide.colors}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              rows={2}
              placeholder="Primary: #3B82F6, Secondary: #10B981, Accent: #F59E0B"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">
              Guidelines
            </label>
            <textarea
              name="assets.styleGuide.guidelines"
              value={values.assets.styleGuide.guidelines}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Do's and don'ts for content creation..."
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block mb-2 text-gray-700">
          Example Posts (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            type="file"
            onChange={(e) => {
              handleFileUpload(e, "examplePosts");
              setUploading((prev) => ({ ...prev, example: true }));
            }}
            multiple
            accept="image/*,video/*"
            className="hidden"
            id="example-upload"
          />
          <label
            htmlFor="example-upload"
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="mt-2 block text-sm font-medium text-gray-700">
              {uploading ? "Uploading..." : "Click to upload example posts"}
            </span>
            <span className="mt-1 text-xs text-gray-500">
              Images or videos showing ideal posts
            </span>
          </label>
        </div>
        {renderPreview(values.assets.examplePosts, "examplePosts")}
      </div>
    </div>
  );
};

export default CreativeAssetsStep;
