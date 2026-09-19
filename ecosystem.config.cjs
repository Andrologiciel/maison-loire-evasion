module.exports = {
  apps: [
    {
      name: "maison-loire-evasion",
      script: "dist/index.js",
      instances: 1,
      autorestart: true,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        HOST: "127.0.0.1",
        PORT: 3000,
      },
    },
  ],
};
