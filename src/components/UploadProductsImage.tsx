'use client'
import { CldUploadButton } from 'next-cloudinary'
interface CloudinaryUploaderProps {
  onUploadImageComplete: (url: string) => void // Define the type explicitly
}

const cloudPresetName = process.env.NEXT_PUBLIC_CLOUDINARY_IMAGE_PRESET_NAME

const CloudinaryImageUploader: React.FC<CloudinaryUploaderProps> = ({ onUploadImageComplete }) => {
  const handleUploadSuccess = (result: any) => {
    if (result.event === 'success') {
      const url = result.info.secure_url
      onUploadImageComplete(url) // Pass the URL back to the parent component
    }
  }
  return (
    <div className="">
      <CldUploadButton
        options={{ multiple: false, sources: ['local', 'url', 'unsplash', 'camera'] }}
        uploadPreset={cloudPresetName}
        className="bg-blue-600 py-2 px-3 rounded border mt-4 text-white
        hover:bg-green-500 transition ease-in-out delay-200"
        onSuccess={handleUploadSuccess} // Handle upload success
      >
        <span className="text-2xl">Upload Image To Cloudinary</span>
      </CldUploadButton>
    </div>
  )
}

export default CloudinaryImageUploader
