// import esline vue
import { ESLint } from "eslint";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    if (body.code === undefined) {
      return {
        statusCode: 400,
        message: "Bad Request",
      };
    }

    // run linter
    const code = body.code;
    const validateNitroCode = (code) => {
      // Check if this is a server route file
      const isServerRoute = code.includes("defineEventHandler");

      if (isServerRoute) {
        let lineNumber = 1;

        // 1. Validate event handler structure
        if (!code.includes("export default defineEventHandler")) {
          throw {
            message:
              "Nitro route handlers must use 'export default defineEventHandler'",
            line: 1,
            column: 0,
          };
        }

        // 2. Check for proper request handling
        const hasRequestBody = code.includes("await readBody(event)");
        const hasRequestQuery = code.includes("getQuery(event)");
        const usesEventWithoutImport =
          code.includes("event.") && !hasRequestBody && !hasRequestQuery;

        if (usesEventWithoutImport) {
          // Find the line where event is improperly used
          const lines = code.split("\n");
          for (let i = 0; i < lines.length; i++) {
            if (
              lines[i].includes("event.") &&
              !lines[i].includes("readBody") &&
              !lines[i].includes("getQuery")
            ) {
              throw {
                message:
                  "Use 'readBody(event)' for POST data or 'getQuery(event)' for query parameters",
                line: i + 1,
                column: lines[i].indexOf("event."),
              };
            }
          }
        }

        // 3. Validate response structure
        const responseRegex = /return\s+{([^}]+)}/g;
        let match;
        let lastIndex = 0;

        while ((match = responseRegex.exec(code)) !== null) {
          lineNumber += (code.slice(lastIndex, match.index).match(/\n/g) || [])
            .length;
          lastIndex = match.index;

          const responseContent = match[1];

          // Check for required response properties
          if (!responseContent.includes("statusCode")) {
            throw {
              message: "API responses must include a 'statusCode' property",
              line: lineNumber,
              column: match.index - code.lastIndexOf("\n", match.index),
            };
          }

          // Validate status code usage
          const statusMatch = responseContent.match(/statusCode:\s*(\d+)/);
          if (statusMatch) {
            const statusCode = parseInt(statusMatch[1]);
            if (![200, 201, 400, 401, 403, 404, 500].includes(statusCode)) {
              throw {
                message: `Invalid status code: ${statusCode}. Use standard HTTP status codes.`,
                line: lineNumber,
                column: statusMatch.index,
              };
            }
          }
        }

        // 4. Check error handling
        if (code.includes("try") && !code.includes("catch")) {
          throw {
            message:
              "Missing error handling. Add a catch block for try statements.",
            line:
              code.split("\n").findIndex((line) => line.includes("try")) + 1,
            column: 0,
          };
        }

        // 5. Validate async/await usage
        const asyncLines = code.match(/async.*=>/g) || [];
        const awaitLines = code.match(/await\s+/g) || [];

        if (awaitLines.length > 0 && asyncLines.length === 0) {
          throw {
            message: "Using 'await' requires an async function",
            line:
              code.split("\n").findIndex((line) => line.includes("await")) + 1,
            column: 0,
          };
        }

        // // 6. Check for proper imports
        // const requiredImports = new Set();
        // if (hasRequestBody) requiredImports.add("readBody");
        // if (hasRequestQuery) requiredImports.add("getQuery");

        // const importLines = code.match(/import.*from/g) || [];
        // requiredImports.forEach((imp) => {
        //   if (!importLines.some((line) => line.includes(imp))) {
        //     throw {
        //       message: `Missing import for '${imp}' utility`,
        //       line: 1,
        //       column: 0,
        //     };
        //   }
        // });
      }
    };

    try {
      validateNitroCode(code);

      const eslint = new ESLint({
        overrideConfig: {
          parser: "@babel/eslint-parser",
          extends: ["@kiwicom"],
          parserOptions: {
            requireConfigFile: false,
            ecmaVersion: 2020,
            sourceType: "module",
          },
        },
        useEslintrc: false,
      });

      const results = await eslint.lintText(code);

      if (results[0].messages.length > 0) {
        const messages = results[0].messages[0];

        if (messages.fatal === true) {
          return {
            statusCode: 400,
            message: "Bad Linter Test",
            data: messages,
          };
        }

        return {
          statusCode: 200,
          message: "Good Linter test",
          data: messages,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 400,
        message: "Bad Linter Test",
        data: {
          message: error.message,
          line: error.line || 1,
          column: error.column || 0,
        },
      };
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal Server Error",
      errror: error,
    };
  }
});
