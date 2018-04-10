const nconf = require('nconf')

nconf.argv().env()
nconf.file('secret', { file: 'config/secret.json' })
nconf.file('default', { file: 'config/default.json' })

export const CONF = (key: string)=> nconf.get(key)
