import npmconf from 'npmconf';

const CONFIG_KEY_SEPARATORS = ['.', '-'];


/**
 * Return context from npm config data
 *
 * @return {Promise}
 */
export default function npm() {
  return new Promise((resolve, reject) => {
    npmconf.load((err, config) => {
      if (err) {
        console.log('npmerr', err);
        reject(err);
      } else {
        resolve(getContext(config));
      }
    });
  });
}

export function getContext(config) {
  const author = getAuthor(config);
  return {
    author,
    formattedAuthor: formatAuthor(author),
    source: config
  };
}


/**
 * Return npm author data
 *
 * @param {Object} config loaded npmconf config object
 * @return {Object}
 */
function getAuthor(config) {
  return {
    name: getConfigValue(config, ['init', 'author', 'name']),
    email: getConfigValue(config, ['init', 'author', 'email']),
    url: getConfigValue(config, ['init', 'author', 'url'])
  };
}


/**
 * Return npm config value
 *
 * @param {Object} config loaded npmconf config object
 * @param {string[]} keys npm config keys
 * @return {string}
 */
function getConfigValue(config, keys) {
  return CONFIG_KEY_SEPARATORS.map(separator => {
    return config.get(keys.join(separator));
  }).find(val => val);
}


/**
 * Format author like `${name} <${email}> (${url})`
 *
 * @param {Object} author author object
 * @param {string|undefined} author.name author name
 * @param {string|undefined} author.email author email
 * @param {string|undefined} author.url author url
 * @return {string}
 */
function formatAuthor(author) {
  const words = [];
  words.push(author.name || '');
  words.push(author.email ? `<${author.email}>` : '');
  words.push(author.url ? `(${author.url})` : '');
  return words.filter(val => val).join(' ');
}
