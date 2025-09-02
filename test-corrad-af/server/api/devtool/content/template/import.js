import fs from "fs";
import path from "path";

import templates from "@@/templates/index.js";

export default defineEventHandler(async (event) => {
  try {
    const query = await getQuery(event);
    const pagePath = query.path;
    const templateId = query.templateId;

    // Get pageName path and check if it exists
    const filePath = path.join(process.cwd() + "/pages/", pagePath + ".vue");
    console.log(filePath);
    if (!fs.existsSync(filePath)) {
      return {
        statusCode: 500,
        message: "File path not found",
      };
    }

    // Get template id from templates
    const template = templates.data.find(
      (template) => template.id === templateId
    );

    // Get template path and check if it exists
    const templatePath = path.join(
      process.cwd() + "/templates/",
      template.filename + ".vue"
    );

    if (!fs.existsSync(templatePath)) {
      return {
        statusCode: 500,
        message: "Template not found",
      };
    }

    // Get template code
    const templateCode = fs.readFileSync(templatePath, "utf8");

    // Write template code to pageName path
    fs.writeFileSync(filePath, templateCode, "utf8");

    return {
      statusCode: 200,
      message: "Template successfully imported",
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
});
