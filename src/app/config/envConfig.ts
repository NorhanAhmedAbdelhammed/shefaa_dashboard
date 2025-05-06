const isLocal = import.meta.env.MODE === 'be-local';

const envConfigKeys = {
  // base_url: isLocal ? 'http://localhost:3000/api/v1/' : import.meta.env.VITE_API_BASE,
  base_url: isLocal
    ? 'https://shefaa-backend-chhn.onrender.com/api/v1'
    : 'https://shefaa-backend-chhn.onrender.com/api/v1',
  google_map_key: import.meta.env.VITE_GOOGLE_MAP_API,
};

Object.entries(envConfigKeys).forEach(([key, val]) => {
  if (!val) {
    if (!import.meta.env.PROD)
      return console.error(
        `${key} is not existed, please check the envirnmental variables to fix this error!`
      );
    return console.error(
      'Some configurations are missing, please contact the developers to check!'
    );
  }
});

export default envConfigKeys;
