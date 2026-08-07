const config = {
  "*.{ts,tsx,js,jsx,mjs,cjs}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css,yml,yaml}": ["prettier --write"],
};

export default config;
