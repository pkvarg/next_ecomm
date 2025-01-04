'use client'

import { CldUploadButton } from 'next-cloudinary'
interface CloudinaryUploaderProps {
  onUploadFileComplete: (url: string) => void // Define the type explicitly
}

const cloudPresetName = process.env.NEXT_PUBLIC_CLOUDINARY_FILE_PRESET_NAME

const CloudinaryFileUploader: React.FC<CloudinaryUploaderProps> = ({ onUploadFileComplete }) => {
  const handleUploadSuccess = (result: any) => {
    if (result.event === 'success') {
      const url = result.info.secure_url
      onUploadFileComplete(url) // Pass the URL back to the parent component
    }
  }
  return (
    <div className="">
      <CldUploadButton
        options={{ multiple: false, sources: ['local', 'url', 'unsplash', 'camera'] }}
        uploadPreset={cloudPresetName}
        className="bg-blue-900 py-2 px-3 rounded border mt-4 text-white
        hover:bg-green-500 transition ease-in-out delay-200"
        onSuccess={handleUploadSuccess} // Handle upload success
      >
        <span className="text-2xl">Upload File To Cloudinary</span>
      </CldUploadButton>
    </div>
  )
}

export default CloudinaryFileUploader
