import path from "node:path";
import fs from "node:fs";

const location = path.join(__dirname, "largeImg.jpg");

export function writeLargeFile() {
  let fileHandle;
  try {
    fileHandle = fs.openSync(location, "w");
    const buffer = Buffer.alloc(1);
    const fileSizeInBytes = 1050000;
    let bytesWritten = 0;
    while (bytesWritten < fileSizeInBytes) {
      fs.writeSync(fileHandle, buffer, 0, buffer.length);
      bytesWritten += buffer.length;
    }
  } catch (error) {
    console.log(error);
  } finally {
    if (fileHandle) {
      fs.closeSync(fileHandle);
    }
  }
}

export function readLargeFile() {
  let fileHandle;
  let fileContents = "";
  try {
    fileHandle = fs.openSync(location, "r");
    const fileStats = fs.fstatSync(fileHandle);
    const bufferSize = fileStats.size;
    const buffer = Buffer.alloc(bufferSize);
    fs.readSync(fileHandle, buffer, 0, bufferSize, 0);
    fileContents = buffer.toString();
    return fileContents;
  } catch (error) {
    console.log(error);
  } finally {
    if (fileHandle) {
      fs.closeSync(fileHandle);
    }
  }
}

export function deleteLargeFile() {
  fs.unlink(location, (error) => {
    if (error) console.log(error);
  });
}
