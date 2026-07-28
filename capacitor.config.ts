import type { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
appId: 'vn.nguonnhaphohcm.app',
  appName: 'Nguồn Nhà Phố HCM',
  webDir: 'public',
  server: {
url: 'https://nguonnhaphohcm.vn',
  cleartext: false,
  },
  ios: {
contentInset: 'always',
  },
};
export default config;
