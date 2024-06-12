/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const lzma = require("lzma-native");
const tar = require("tar");
const { Storage } = require("@google-cloud/storage");
const os = require("os");
const path = require("path");
const fs = require("fs-extra");

admin.initializeApp();
const storage = new Storage();

/**
 * Decompress and extract .tar.xz files uploaded to Firebase Storage
 *
 * @param {object} object - The object metadata of the uploaded file.
 */

exports.decompressTarXz = functions.storage
  .object()
  .onFinalize(async (object) => {
    const bucketName = object.bucket;
    const filePath = object.name;
    const fileName = path.basename(filePath);

    if (!filePath.endsWith(".tar.xz")) {
      console.log(`Skipping file ${fileName} as it is not a .tar.xz file.`);
      return;
    }

    const tempLocalFile = path.join(os.tmpdir(), fileName);
    const tempDecompressedFile = `${tempLocalFile}.tar`;
    const outputDir = path.join(
      os.tmpdir(),
      path.basename(fileName, ".tar.xz")
    );

    await storage
      .bucket(bucketName)
      .file(filePath)
      .download({ destination: tempLocalFile });

    try {
      await decompressXz(tempLocalFile, tempDecompressedFile);
      await extractTar(tempDecompressedFile, outputDir);
      await uploadExtractedFiles(outputDir, bucketName);
      console.log(`Successfully decompressed and extracted ${fileName}`);
    } catch (error) {
      console.error("Error during decompression and extraction", {
        message: error.message,
        stack: error.stack,
        tempLocalFile,
        tempDecompressedFile,
        outputDir,
      });
    } finally {
      fs.removeSync(tempLocalFile);
      fs.removeSync(tempDecompressedFile);
      fs.removeSync(outputDir);
    }
  });

/**
 * Decompress an .xz file.
 *
 * @param {string} inputPath - The path to the input .xz file.
 * @param {string} outputPath - The path to the output decompressed file.
 * @return {Promise<void>}
 */
function decompressXz(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);
    const decompressor = lzma.createDecompressor();
    input
      .pipe(decompressor)
      .pipe(output)
      .on("finish", resolve)
      .on("error", reject);
  });
}

/**
 * Extract a .tar file.
 *
 * @param {string} filePath - The path to the .tar file.
 * @param {string} outputDir - The directory to extract the files into.
 * @return {Promise<void>}
 */
function extractTar(filePath, outputDir) {
  return tar.extract({ file: filePath, cwd: outputDir });
}

/**
 * Upload extracted files to Firebase Storage.
 *
 * @param {string} directoryPath - The path to the directory containing
 * the extracted files.
 * @param {string} bucketName - The name of the Firebase Storage bucket.
 * @return {Promise<void>}
 */
async function uploadExtractedFiles(directoryPath, bucketName) {
  const files = await fs.readdir(directoryPath);
  const bucket = storage.bucket(bucketName);
  for (const file of files) {
    const localFilePath = path.join(directoryPath, file);
    await bucket.upload(localFilePath, {
      destination: `extracted/${file}`,
    });
  }
}
