module.exports = {
  extends: ["@commitlint/config-conventional"],
  plugins: ["commitlint-plugin-function-rules"],
  rules: {
    "header-max-length": [0], // level: disabled
    "function-rules/header-max-length": [
      2, // level: error
      "always",
      (parsed) => {
        if (parsed.header.length > 100) {
          return [false, `o commit não deve ter mais de 100 caracteres, o comprimento atual é ${parsed.header.length}`];
        }
        if (
          !parsed.header.match(/^((feat)|(test)|(build)|(chore)|(ci)|(docs)|(fix)|(perf)|(refactor)|(style)): .+/gm)
        ) {
          return [false, `a mensagem de commit deve seguir o padrão "type: message"`];
        }
        return [true];
      },
    ],
  },
};
