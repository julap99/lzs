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

    const code = body.code;

    // Extract script and template content once
    const scriptContent =
      code.match(/<script\b[^>]*>([\s\S]*?)<\/script>/)?.[1] || "";
    const templateContent = code.match(/<template>([\s\S]*)<\/template>/)?.[1];

    // Validate FormKit inputs
    const validateFormKit = (content) => {
      // List of valid FormKit input types
      const validFormKitTypes = [
        "text",
        "email",
        "url",
        "tel",
        "password",
        "number",
        "date",
        "datetime-local",
        "time",
        "month",
        "week",
        "search",
        "color",
        "file",
        "range",
        "checkbox",
        "radio",
        "select",
        "textarea",
        "submit",
        "button",
      ];

      // Find all FormKit components
      const formKitRegex = /<FormKit[^>]*>/g;
      let formKitMatch;

      // Start counting from template tag
      let lineNumber = content
        .slice(0, content.indexOf("<template"))
        .split("\n").length;
      let lastIndex = 0;

      while ((formKitMatch = formKitRegex.exec(content)) !== null) {
        // Calculate correct line number including the lines before template
        lineNumber += (
          content.slice(lastIndex, formKitMatch.index).match(/\n/g) || []
        ).length;
        lastIndex = formKitMatch.index;

        const formKitTag = formKitMatch[0];

        // Extract type attribute
        const typeMatch = formKitTag.match(/type=["']([^"']+)["']/);
        if (!typeMatch) {
          throw {
            message: "FormKit component missing required 'type' attribute",
            line: lineNumber,
            column:
              formKitMatch.index -
              content.lastIndexOf("\n", formKitMatch.index),
          };
        }

        const inputType = typeMatch[1];
        if (!validFormKitTypes.includes(inputType)) {
          throw {
            message: `Invalid FormKit type: "${inputType}". Please use a valid input type.`,
            line: lineNumber,
            column:
              formKitMatch.index -
              content.lastIndexOf("\n", formKitMatch.index),
          };
        }

        // Check for options in select, radio, and checkbox types
        if (["select", "radio", "checkbox"].includes(inputType)) {
          // Look for :options or v-model
          const hasOptions =
            formKitTag.includes(":options=") || formKitTag.includes("v-model=");
          const hasSlotContent =
            content
              .slice(
                formKitMatch.index,
                content.indexOf(">", formKitMatch.index)
              )
              .includes(">") &&
            content
              .slice(
                formKitMatch.index,
                content.indexOf("</FormKit>", formKitMatch.index)
              )
              .includes("<option");

          if (!hasOptions && !hasSlotContent) {
            throw {
              message: `FormKit ${inputType} requires options. Add :options prop or option slots.`,
              line: lineNumber,
              column:
                formKitMatch.index -
                content.lastIndexOf("\n", formKitMatch.index),
            };
          }
        }
      }
    };

    // Add new function to validate mustache syntax
    const validateMustacheSyntax = (content) => {
      const stack = [];
      let lineNumber = 1;
      let lastIndex = 0;

      for (let i = 0; i < content.length; i++) {
        if (content[i] === "\n") {
          lineNumber++;
          lastIndex = i + 1;
        }

        if (content[i] === "{" && content[i + 1] === "{") {
          stack.push({
            position: i,
            line: lineNumber,
            column: i - lastIndex,
          });
          i++; // Skip next '{'
        } else if (content[i] === "}" && content[i + 1] === "}") {
          if (stack.length === 0) {
            throw {
              message:
                "Unexpected closing mustache brackets '}}' without matching opening brackets",
              line: lineNumber,
              column: i - lastIndex,
            };
          }
          stack.pop();
          i++; // Skip next '}'
        }
      }

      if (stack.length > 0) {
        const unclosed = stack[0];
        throw {
          message:
            "Unclosed mustache brackets '{{'. Missing closing brackets '}}",
          line: unclosed.line,
          column: unclosed.column,
        };
      }
    };

    // Check template content and FormKit validation
    if (templateContent) {
      try {
        validateMustacheSyntax(templateContent);
        validateFormKit(templateContent);
      } catch (error) {
        return {
          statusCode: 400,
          message: "Template Syntax Error",
          data: {
            message: error.message,
            line: error.line,
            column: error.column,
          },
        };
      }

      // Check for undefined variables
      const definedVariables = new Set();

      // Add common Vue variables
      const commonVueVars = [
        "$route",
        "$router",
        "$refs",
        "$emit",
        "$slots",
        "$attrs",
      ];
      commonVueVars.forEach((v) => definedVariables.add(v));

      // Extract refs and other variables from script
      const refRegex = /(?:const|let|var)\s+(\w+)\s*=/g;
      let varMatch;
      while ((varMatch = refRegex.exec(scriptContent)) !== null) {
        definedVariables.add(varMatch[1]);
      }

      // Extract defineProps if any
      const propsMatch = scriptContent.match(/defineProps\(\s*{([^}]+)}\s*\)/);
      if (propsMatch) {
        const propsContent = propsMatch[1];
        const propNames = propsContent.match(/(\w+)\s*:/g);
        propNames?.forEach((prop) => {
          definedVariables.add(prop.replace(":", "").trim());
        });
      }

      // Check template for undefined variables
      const mustacheRegex = /{{([^}]+)}}/g;
      let lineNumber = 1;
      let lastIndex = 0;
      let mustacheMatch;

      while ((mustacheMatch = mustacheRegex.exec(templateContent)) !== null) {
        // Calculate line number
        lineNumber += (
          templateContent.slice(lastIndex, mustacheMatch.index).match(/\n/g) ||
          []
        ).length;
        lastIndex = mustacheMatch.index;

        const expression = mustacheMatch[1].trim();
        // Split expression and check each variable
        const variables = expression.split(/[\s.()[\]]+/);

        for (const variable of variables) {
          // Skip numbers, operators, and empty strings
          if (
            !variable ||
            variable.match(/^[\d+\-*/&|!%<>=?:]+$/) ||
            variable === "true" ||
            variable === "false"
          ) {
            continue;
          }

          if (!definedVariables.has(variable)) {
            return {
              statusCode: 400,
              message: "Template Reference Error",
              data: {
                message: `Variable "${variable}" is not defined`,
                line: lineNumber,
                column:
                  mustacheMatch.index -
                  templateContent.lastIndexOf("\n", mustacheMatch.index),
              },
            };
          }
        }
      }
    }

    // Validate template structure
    const validateTemplateStructure = (code) => {
      // Check for root level template and script tags
      const rootTemplateCount = (
        code.match(/^[\s\S]*<template>[\s\S]*<\/template>/g) || []
      ).length;
      const rootScriptCount = (
        code.match(/^[\s\S]*<script>[\s\S]*<\/script>/g) || []
      ).length;

      if (rootTemplateCount > 1 || rootScriptCount > 1) {
        throw new Error(
          "Vue components must have only one root <template> and one <script> tag"
        );
      }

      // Extract template content for further validation
      const templateContent = code.match(
        /<template>([\s\S]*)<\/template>/
      )?.[1];
      if (templateContent) {
        const tagStack = [];
        const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9:-]*)\s*([^>]*?)(\/?)>/g;
        let match;
        let lineNumber = 1;
        let lastIndex = 0;

        while ((match = tagRegex.exec(templateContent)) !== null) {
          const [fullTag, tagName, attributes, selfClosing] = match;

          // Calculate line number
          lineNumber += (
            templateContent.slice(lastIndex, match.index).match(/\n/g) || []
          ).length;
          lastIndex = match.index;

          // Skip comments
          if (templateContent.slice(match.index).startsWith("<!--")) {
            const commentEnd = templateContent.indexOf("-->", match.index);
            if (commentEnd !== -1) {
              tagRegex.lastIndex = commentEnd + 3;
              continue;
            }
          }

          if (!fullTag.endsWith(">")) {
            throw {
              message: `Malformed tag found: ${fullTag}`,
              line: lineNumber,
              column:
                match.index - templateContent.lastIndexOf("\n", match.index),
            };
          }

          if (selfClosing || fullTag.endsWith("/>")) continue;

          if (!fullTag.startsWith("</")) {
            tagStack.push({
              name: tagName,
              line: lineNumber,
              column:
                match.index - templateContent.lastIndexOf("\n", match.index),
            });
          } else {
            if (tagStack.length === 0) {
              throw {
                message: `Unexpected closing tag </${tagName}> found without matching opening tag`,
                line: lineNumber,
                column:
                  match.index - templateContent.lastIndexOf("\n", match.index),
              };
            }

            const lastTag = tagStack[tagStack.length - 1];
            if (lastTag.name !== tagName) {
              throw {
                message: `Mismatched tags: expected closing tag for "${lastTag.name}" but found "${tagName}"`,
                line: lineNumber,
                column:
                  match.index - templateContent.lastIndexOf("\n", match.index),
              };
            }
            tagStack.pop();
          }
        }

        if (tagStack.length > 0) {
          const unclosedTag = tagStack[tagStack.length - 1];
          throw {
            message: `Unclosed tag: ${unclosedTag.name}`,
            line: unclosedTag.line,
            column: unclosedTag.column,
          };
        }
      }

      return true;
    };

    try {
      validateTemplateStructure(code);
    } catch (structureError) {
      return {
        statusCode: 400,
        message: "Template Structure Error",
        data: {
          message: structureError.message,
          line: structureError.line || 1,
          column: structureError.column || 0,
        },
      };
    }

    // ESLint configuration
    const eslint = new ESLint({
      overrideConfig: {
        extends: ["plugin:vue/vue3-recommended"],
        parserOptions: {
          parser: "espree",
          ecmaVersion: 2022,
          sourceType: "module",
        },
      },
      useEslintrc: false,
    });

    const results = await eslint.lintText(code);

    if (results[0].messages.length > 0) {
      const message = results[0].messages[0];

      if (message.fatal === true) {
        return {
          statusCode: 400,
          message: "Bad Linter Test",
          data: {
            message: message.message,
            line: message.line,
            column: message.column,
          },
        };
      }

      return {
        statusCode: 200,
        message: "Good Linter test",
        data: {
          message: message.message,
          line: message.line,
          column: message.column,
        },
      };
    }

    return {
      statusCode: 200,
      message: "Code validation passed",
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal Server Error",
      error: error.message,
    };
  }
});
