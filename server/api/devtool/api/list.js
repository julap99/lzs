import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  try {
    // get api folder path from server root folder and its files and folders inside it
    const apiFolderPath = path.join(process.cwd() + "/server/api");
    const apis = fs.readdirSync(apiFolderPath);

    const apiList = getFilesAndFolders(apiFolderPath);

    const apiUrls = getApiUrls(apiList);
    const jsonObject = JSON.parse(JSON.stringify(apiUrls));

    return {
      statusCode: 200,
      message: "API List successfully fetched",
      data: jsonObject,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message,
    };
  }
});

function getFilesAndFolders(folderPath) {
  const folderFiles = fs.readdirSync(folderPath);
  const files = [];
  const folders = [];
  const apiURL = "/api";

  folderFiles.forEach((file) => {
    const filePath = path.join(folderPath + "/" + file);
    if (file == "devtool") return;
    if (fs.lstatSync(filePath).isDirectory()) {
      folders.push(getFilesAndFolders(filePath));
    } else {
      const processPath = path.join(process.cwd() + "/server/api");
      const apiUrl = filePath
        .replace(processPath, apiURL)
        .replace(/\\/g, "/")
        .replace(".js", "");
      const fileName = file.replace(".js", "");
      const parentFolder = folderPath
        .replace(processPath, "")
        .replace(/\\/g, "");

      files.push({
        name: fileName,
        parentName: parentFolder,
        url: apiUrl,
      });
    }
  });

  return { files, folders };
}

function getApiUrls(folder) {
  const apiUrls = [];

  folder.files.forEach((file) => {
    apiUrls.push({
      name: file.name,
      parentName: file.parentName,
      url: file.url,
    });
  });

  folder.folders.forEach((nestedFolder) => {
    apiUrls.push(...getApiUrls(nestedFolder));
  });

  return apiUrls;
}
