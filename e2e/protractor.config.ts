import {Config} from 'protractor';
import * as tsNode from 'ts-node';

const serverAddress = 'http://localhost:4723/wd/hub';
const testFilePAtterns: Array<string> = [
  '**/*/*.e2e-spec.ts'
];
// const iPhoneXCapability = {
//   browserName: '',
//   autoWebview: true,
//   autoWebviewTimeout: 20000,
//   app: '/Users/${user}/ordina/e2e/superApp/platforms/ios/build/emulator/superApp.app',
//   version: '11.4',
//   platform: 'iOS',
//   deviceName: 'iPhone X',
//   platformName: 'iOS',
//   name: 'My First Mobile Test',
//   automationName: 'XCUITest',
//   nativeWebTap: 'true'
// };
const androidPixel2XLCapability = {
  browserName: '',
  autoWebview: true,
  autoWebviewTimeout: 20000,
  platformName: 'Android',
  deviceName: 'pixel2xl',
  app: '/Users/tarunkumarpal/Desktop/app-debug.apk',
  'app-package': 'com.ionicframework.fyle595781.staging',
  'app-activity': 'MainActivity',
  autoAcceptAlerts: 'true',
  autoGrantPermissions: 'true',
  newCommandTimeout: 300000
};

export let config: Config = {
  allScriptsTimeout: 11000,
  specs: testFilePAtterns,
  baseUrl: '',
  multiCapabilities: [
    androidPixel2XLCapability,
    // iPhoneXCapability
  ],
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  },
  seleniumAddress: serverAddress,
  onPrepare: () => {
    tsNode.register({
      project: 'e2e/tsconfig.json'
    });
  }
};