"use client";
import axios from "axios";
import React, { useState } from "react";
function UploadAutoCad() {
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);


  async function AddFile(e) {
    const file = e.target.files[0];

    if (!file || (!file.name.endsWith(".dwg") && !file.name.endsWith(".dxf"))) {
      console.log("Incorrect File Format");
      setError(true);
      setMessage("Incorrect file format. Only .dwg and .dxf are allowed.");
      return;
    }

    setError(false);
    setMessage("Uploading...");

    try {
      // Step 1: Authenticate and get access token
      console.log("Step 1: Authenticating...");
      const authResponse = await axios.get("http://localhost:5000/auth");
      const accessToken = authResponse.data.access_token;
      localStorage.setItem("Forge3d", accessToken);
      console.log("Step 1 Completed - Access Token Received");

      // Step 2: Check and create bucket if it doesn't exist
      console.log("Step 2: Checking/Creating Bucket...");
      await axios.post("http://localhost:5000/check-create-bucket");
      console.log("Step 2 Completed - Bucket Ready");

      // Step 3: Upload file to Forge
      console.log("Step 3: Uploading File...");
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await axios.post(
        "http://localhost:5000/upload_file",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (uploadResponse.data && uploadResponse.data.objectKey) {
        console.log("Step 3 Completed - File Uploaded", uploadResponse.data);

        // Step 4: Translate the File for Forge Viewer
        console.log("Step 4: Requesting File Translation...");
        const translateResponse = await axios.post(
          "http://localhost:5000/translatefile",
          {
            objectKey: uploadResponse.data.objectKey,
          }
        );

        console.log(
          "Step 4 Completed - Translation Requested",
          translateResponse.data
        );
        setMessage("File uploaded and translation started.");

        if (translateResponse.data.urn) {
          // router.push('/viewer.html?urn=' + translateResponse.data.urn)
          window.location.replace(
            "/viewer.html?urn=" + translateResponse.data.urn
          ); //To Reload The Page
        } else {
          setMessage("Translation failed.");
        }
      } else {
        console.error("Error: File upload failed.");
        setMessage("File upload failed.");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setMessage("Something went wrong.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
    <h2 className="text-4xl font-semibold mb-4 text-center text-gray-100">
      Upload Your AutoCAD File
    </h2>
    <p className="text-lg text-gray-300 text-center max-w-2xl mb-6">
      Upload DWG or DXF files to load and interact with your 3D model seamlessly.
    </p>
  
    <div className="flex flex-col items-center w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <label className="text-lg font-medium text-gray-200 mb-3">
        Select an AutoCAD File:
      </label>
  
      <label className="w-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:border-teal-400 transition duration-300">
        <span className="text-gray-400 text-lg">Click to Add File</span>
        <input type="file" className="hidden" onChange={AddFile} />
      </label>
  
      {error && <span className="text-red-400 mt-4">{message}</span>}
      {!error && message && <span className="text-green-400 mt-4">{message}</span>}
    </div>
  </div>
  
  
  );
}

export default UploadAutoCad;
