export const PROXY_SERVER = 'us.smartproxy.net';
export const PROXY_PORT = 3120;
export const PROXY_PASSWORD = 'xEdCpOSFn3nd4ixu';
export const PROXY_PREFIX = 'smart-pwgbkxcy3lyi';

export const US_STATE_CITIES: Record<string, string[]> = {
  TX: ['AUSTIN', 'DALLAS', 'HOUSTON', 'SANANTONIO', 'FORTWORTH'],
  CA: ['LA', 'SF', 'SANDIEGO', 'FRESNO', 'SACRAMENTO'],
  NY: ['NEWYORK', 'BUFFALO', 'ROCHESTER', 'YONKERS', 'SYRACUSE'],
  FL: ['MIAMI', 'ORLANDO', 'TAMPA', 'JACKSONVILLE', 'STPETERSBURG'],
  WA: ['SEATTLE', 'SPOKANE', 'TACOMA', 'BELLEVUE', 'KENT'],
  IL: ['CHICAGO', 'AURORA', 'JOLIET', 'ROCKFORD', 'NAPERVILLE'],
  AZ: ['PHOENIX', 'TUCSON', 'MESA', 'CHANDLER', 'SCOTTSDALE'],
  GA: ['ATLANTA', 'AUGUSTA', 'COLUMBUS', 'SAVANNAH', 'MACON'],
  NC: ['CHARLOTTE', 'RALEIGH', 'GREENSBORO', 'DURHAM', 'WINSTON'],
  OH: ['COLUMBUS', 'CLEVELAND', 'CINCINNATI', 'TOLEDO', 'AKRON'],
};

export const STATE_TIMEZONES: Record<string, string> = {
  TX: 'America/Chicago',
  CA: 'America/Los_Angeles',
  NY: 'America/New_York',
  FL: 'America/New_York',
  WA: 'America/Los_Angeles',
  IL: 'America/Chicago',
  AZ: 'America/Phoenix',
  GA: 'America/New_York',
  NC: 'America/New_York',
  OH: 'America/New_York',
};

export const PROXY_LIVES = ['1hr', '2hr', '4hr', '8hr', '24hr'] as const;

export const LIFE_MS: Record<string, number> = {
  '1hr': 3600000,
  '2hr': 7200000,
  '4hr': 14400000,
  '8hr': 28800000,
  '24hr': 86400000,
};

export const ANDROID_DEVICES = [
  { model: 'Samsung Galaxy S23', gpu: 'Adreno 740', resolution: '1080x2340', android: '13' },
  { model: 'Google Pixel 7', gpu: 'Mali-G710', resolution: '1080x2400', android: '13' },
  { model: 'OnePlus 11', gpu: 'Adreno 740', resolution: '1080x2412', android: '13' },
  { model: 'Samsung Galaxy A54', gpu: 'Mali-G68', resolution: '1080x2340', android: '13' },
  { model: 'Google Pixel 6a', gpu: 'Mali-G78', resolution: '1080x2400', android: '12' },
  { model: 'Xiaomi 13', gpu: 'Adreno 740', resolution: '1080x2400', android: '13' },
  { model: 'Samsung Galaxy S22', gpu: 'Adreno 730', resolution: '1080x2340', android: '12' },
  { model: 'Motorola Edge 40', gpu: 'Adreno 732', resolution: '1080x2400', android: '13' },
  { model: 'Nothing Phone 2', gpu: 'Adreno 740', resolution: '1080x2412', android: '13' },
  { model: 'Samsung Galaxy A34', gpu: 'Mali-G68', resolution: '1080x2408', android: '13' },
];

export const WINDOWS_UA_LIST = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
];

export const MACOS_VERSIONS = ['12.6', '13.2', '13.4', '14.0', '14.1'];

export const WINDOWS_WEBGL = [
  'NVIDIA GeForce RTX 3060',
  'AMD Radeon RX 6600',
  'Intel UHD Graphics 770',
  'NVIDIA GeForce GTX 1660',
  'AMD Radeon RX 6500 XT',
  'Intel Arc A380',
];

export const CPU_CORES = [4, 6, 8, 12, 16];
export const RAM_SIZES = [8, 16, 32];
