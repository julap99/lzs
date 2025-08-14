import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  const query = await getQuery(event);

  let code = "";
  // console.log(query.path);

  try {
    // Get vue code from path in query
    const filePath = path.join(process.cwd() + "/pages/", query.path + ".vue");
    try {
      code = fs.readFileSync(filePath, "utf8");
      return {
        statusCode: 200,
        message: "Code successfully loaded",
        data: code,
      };
    } catch (error) {}

    // Check if there is path with index.vue
    const filePathIndex = path.join(
      process.cwd() + "/pages/",
      query.path + "/index.vue"
    );

    code = fs.readFileSync(filePathIndex, "utf8");

    // Only get the template part of the code and make sure its from the first template tag to the last template tag
    code = code.substring(
      code.indexOf("<template>") + 10,
      code.lastIndexOf("</template>")
    );

    return {
      statusCode: 200,
      message: "Code successfully loaded",
      data: code,
      mode: "index",
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "File not found",
    };
  }
});
