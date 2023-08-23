module.exports = {
  modulePathIgnorePatterns: [
    "<rootDir>/dist/",
    "<rootDir>/node_modules/",
    "<rootDir>/dist/",
  ],
  testTimeout: 15000,
  setupFilesAfterEnv: ["./setup-jest.js"],
};
