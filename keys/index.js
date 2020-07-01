if (process.env.NODE_ENV === 'production') {
  module.exports = require('./keysprod')
} else {
  module.exports = require('./keysdev')
}

