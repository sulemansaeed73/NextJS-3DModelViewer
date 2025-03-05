const axios = require("axios");
require("dotenv").config();
const BucketModel = require("../Models/Bucket");
const fs = require("fs");
var Buffer = require("buffer").Buffer;
const { AuthenticationClient, Scopes } = require("@aps_sdk/authentication");
const authenticationClient = new AuthenticationClient();

const {
  ModelDerivativeClient,
  View,
  OutputType,
} = require("@aps_sdk/model-derivative");
const modelDerivativeClient = new ModelDerivativeClient();
const { AuthClientTwoLegged, BucketsApi, ObjectsApi } = require("forge-apis");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SCOPES = [
  "data:read",
  "data:write",
  "data:create",
  "bucket:create",
  "bucket:read",
  "bucket:update",
];
const authClient = new AuthClientTwoLegged(CLIENT_ID, CLIENT_SECRET, SCOPES);

async function getInternalToken() {
  const credentials = await authenticationClient.getTwoLeggedToken(
    CLIENT_ID,
    CLIENT_SECRET,
    [
      Scopes.DataRead,
      Scopes.DataCreate,
      Scopes.DataWrite,
      Scopes.BucketCreate,
      Scopes.BucketRead,
    ]
  );
  return credentials.access_token;
}

module.exports = {
  async Auth(req, res) {
    try {
      const credentials = await authClient.authenticate();
      return res.status(200).json({ access_token: credentials.access_token });
    } catch (error) {
      console.error("Auth Error:", error);
      return res.status(500).json({ error: "Authentication Failed" });
    }
  },

  async checkAndCreateBucket(req, res) {
    let bucketRecord = await BucketModel.findOne();
    let bucketName;
    const bucketsApi = new BucketsApi();
    const credentials = await authClient.authenticate();
    try {
      if (bucketRecord) {
        bucketName = bucketRecord.Name;
        console.log("Using existing bucket:", bucketName);
      } else {
        bucketName = `bucket-${Date.now()}`;
        const newBucket = new BucketModel({ Name: bucketName });
        await newBucket.save();
        console.log("New bucket name generated:", bucketName);
      }

      try {
        await bucketsApi.getBucketDetails(bucketName, authClient, credentials);
        console.log("Bucket Already EXists");
        res.json({ message: "Bucket already exists", bucket: bucketName });
      } catch (error) {
        console.log("No need to create another bucket");
        await bucketsApi.createBucket(
          { bucketKey: bucketName, policyKey: "transient" },
          {},
          authClient,
          credentials
        );
        res.json({ message: "Bucket created", bucket: bucketName });
      }
    } catch (error) {
      console.error(
        "Error processing the bucket request:",
        error.message || error
      );
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  async UploadAutoCad(req, res) {
    try {
      let bucketRecord = await BucketModel.findOne();
      let bucketName;

      if (bucketRecord) {
        bucketName = bucketRecord.Name;
        console.log("Using existing bucket:", bucketName);
      } else {
        // Handle if the bucket doesn't exist
        return res
          .status(400)
          .json({ error: "No bucket found. Please create a bucket first." });
      }

      const credentials = await authClient.authenticate();
      const objectsApi = new ObjectsApi();

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const filePath = req.file.path;
      const fileName = req.file.originalname;
      const fileData = fs.readFileSync(filePath);

      console.log(
        `File to Upload: ${fileName} (Size: ${fileData.length} bytes)`
      );

      // Request a Signed URL for the file upload
      console.log("Requesting Signed URL for:", fileName);

      const signedUrlRequest = {
        minutesExpiration: 30,
        singleUse: false,
      };

      const signedUrlResponse = await objectsApi.createSignedResource(
        bucketName,
        fileName,
        signedUrlRequest,
        { access: "readwrite" },
        authClient,
        credentials
      );

      const signedUrl = signedUrlResponse.body.signedUrl;
      console.log("Signed URL Received:", signedUrl);

      // Upload the file to the Signed URL
      console.log("Uploading File...");

      await axios.put(signedUrl, fileData, {
        headers: { "Content-Type": "application/octet-stream" },
      });

      console.log("Upload Success!");

      res.json({
        message: "File uploaded successfully",
        objectKey: fileName,
      });
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to upload file" });
    }
  },

  async Translate(req, res) {
    const { objectKey } = req.body;
    console.log("Object key is ", objectKey);
    let bucketRecord = await BucketModel.findOne();
    let bucketName;
    if (bucketRecord) {
      bucketName = bucketRecord.Name;
      console.log("Using existing bucket:", bucketName);
    } else {
      return res
        .status(400)
        .json({ error: "No bucket found. Please create a bucket first." });
    }

    const objectId = `urn:adsk.objects:os.object:${bucketName}/${objectKey}`;
    const buf = Buffer.from(objectId, "ascii");
    const urn = buf.toString("base64").replace(/=+$/, "");
    console.log("Correct URN:", urn);
    const accessToken = await getInternalToken();

    try {
      const job = await modelDerivativeClient.startJob(
        {
          input: {
            urn,
          },
          output: {
            formats: [
              {
                views: [View._2d, View._3d],
                type: OutputType.Svf2,
              },
            ],
          },
        },
        { accessToken }
      );

      console.log("Translation job started:", job.result);

      res.json({ message: "Translation request submitted!", urn: urn });
    } catch (error) {
      console.log("Error during translation:", error);
      res.send("Error at Model Derivative job.");
    }
  },

  // async checker(req, res) {
  //   const bucketName = "bucket-1738329722050";
  //   const objectKey = "architectural_example-imperial.dwg";

  //   const objectId = `urn:adsk.objects:os.object:1megopvvpbqiuvkmqd3oxhomiawyiq2rmbc7j5yyg7ydaysa-basic-app/building.dwg`;
  //   const buf = Buffer.from(objectId, "ascii");
  //   const urn = buf.toString("base64").replace(/=+$/, "");
  //   console.log("Correct URN:", urn);

  //   res.json({ urn: urn });
  // },
};
