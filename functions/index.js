const functions = require("firebase-functions");
const admin = require("firebase-admin");
const lzma = require("lzma-native");
const tar = require("tar");
const {Storage} = require("@google-cloud/storage");
const os = require("os");
const path = require("path");
const fs = require("fs-extra");

admin.initializeApp();
const storage = new Storage();

/**
 * Decompress and extract .tar.xz files uploaded to Firebase Storage
 *
 * @param {object} object
 */

exports.decompressTarXz = functions
// increase memory to 1GB and execution time of 540s
    .runWith({memory: "1GB", timeoutSeconds: 540})
    .storage.object()
    // when upload a new file to storage
    .onFinalize(async (object) => {
      // extract file info
      const bucketName = object.bucket;
      const filePath = object.name;
      const fileName = path.basename(filePath);

      console.log(`Processing file: ${filePath}`);

      // if the file is not '.tar.xz' skip
      if (!filePath.endsWith(".tar.xz")) {
        console.log(`Skipping file ${fileName} as it is not a .tar.xz file.`);
        return;
      }

      // add the file to the temporal storage
      const tempLocalFile = path.join(os.tmpdir(), fileName);
      const tempDecompressedFile = `${tempLocalFile}.tar`;
      const outputDir = path.join(
          os.tmpdir(),
          path.basename(fileName, ".tar.xz"),
      );

      console.log(`Downloading file to: ${tempLocalFile}`);

      // try catch for managment errors
      try {
        // dowload the file of temporal storage
        await storage
            .bucket(bucketName)
            .file(filePath)
            .download({destination: tempLocalFile});
        console.log(`Downloaded file: ${tempLocalFile}`);

        // ensure that output dir exists
        fs.ensureDirSync(outputDir);
        console.log(`Decompressing file to: ${tempDecompressedFile}`);

        // executing the other functions
        await decompressXz(tempLocalFile, tempDecompressedFile);
        console.log(`Decompressed file to: ${tempDecompressedFile}`);
        console.log(`Extracting tar file to: ${outputDir}`);


        await extractTar(tempDecompressedFile, outputDir);
        console.log(`Extracted tar file to: ${outputDir}`);
        console.log(`Uploading extracted files to bucket: ${bucketName}`);


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
        // reset the file for temporal storage
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

  the firts param is the file .xz, the second is
  the path to save the descompressed file

*/
function decompressXz(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    // create streams of input and output
    // input is for compress file
    // output is for descompress file
    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);

    // create descompressor
    const decompressor = lzma.createDecompressor();

    // conect streams
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

  the firts param is the file .tar, the second is
  the path to save the descompressed file
*/
function extractTar(filePath, outputDir) {
  // return the result of tar.extract
  // cwd -> current working directory
  return tar.extract({file: filePath, cwd: outputDir});
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
  // with fs read all files that contain directory
  const files = await fs.readdir(directoryPath);
  const bucket = storage.bucket(bucketName);

  // for each file upload to storage
  for (const file of files) {
    const localFilePath = path.join(directoryPath, file);

    // get info about the file
    const stats = await fs.stat(localFilePath);
    if (stats.isFile()) {
      await bucket.upload(localFilePath, {
        destination: `myFiles/${file}`,
      });
    } else if (stats.isDirectory()) {
      // if is directory callback to same function
      await uploadExtractedFiles(localFilePath, bucketName);
    }
  }
}
