const {defineConfig}=require('@playwright/test');

module.exports=defineConfig({
  testDir:'./tests/e2e',
  fullyParallel:true,
  forbidOnly:!!process.env.CI,
  retries:0,
  workers:process.env.CI?2:undefined,
  reporter:'list',
  use:{baseURL:'http://127.0.0.1:4173',browserName:'chromium',headless:true,trace:'retain-on-failure'},
  webServer:{command:'npm run build && node scripts/serve-dist.js',url:'http://127.0.0.1:4173',reuseExistingServer:false,timeout:120000}
});
