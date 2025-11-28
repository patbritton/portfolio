module.exports = {
  apps: [{
    name: "portfolio",
    script: "./dist/server/entry.mjs",
    env: {
      HOST: "127.0.0.1",
      PORT: 4321,
      EMAIL_USER: "your.real.email@gmail.com",
      EMAIL_PASS: "your-gmail-app-password" 
    }
  }]
}