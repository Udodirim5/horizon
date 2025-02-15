import React, { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl);

  // const onDrop = useCallback(
  //   (acceptedFiles: FileWithPath[]) => {
  //     setFile(acceptedFiles);
  //     fieldChange(acceptedFiles);
  //     const fileUrl = URL.createObjectURL(acceptedFiles[0]);
  //     setFileUrl(fileUrl);
  //   },
  //   [file]
  // );

  // const { getRootProps, getInputProps } = useDropzone({
  //   onDrop,
  //   accept: { "image/*": [".png", "jpeg", ".jpg", ".svg+xml"] },
  // });

  const acceptedFormats = [".png", ".jpeg", ".jpg", ".svg+xml"];

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const validFiles = acceptedFiles.filter((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase();
      return extension && acceptedFormats.includes(`.${extension}`);
    });

    if (validFiles.length === 0) {
      alert("Invalid file format. Please upload an image.");
      return;
    }

    setFile(validFiles);
    fieldChange(validFiles);

    const fileUrl = URL.createObjectURL(validFiles[0]);
    setFileUrl(fileUrl);
  }, [file]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] }, // Leave empty because we're handling validation manually
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10 ">
            <img
              src={fileUrl}
              alt="uploaded-image"
              className="file_uploader-img"
            />
          </div>
          <p className="file_uploader-label">Click or drag photo to replace</p>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            src="/assets/icons/file-upload.svg"
            alt="file-upload"
            width={96}
            height={77}
          />
          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Drag & drop your photo here
          </h3>
          <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>

          <Button className="shad-button_dark_4">Choose a file</Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
