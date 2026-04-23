import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ru.konconsulting.loyalty',
  appName: 'КОН',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      launchFadeOutDuration: 300,
      androidSplashResourceName: 'splash',
      showSpinner: false,
      backgroundColor: '#0f172a',
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
