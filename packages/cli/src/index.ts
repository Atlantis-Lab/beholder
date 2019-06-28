import program from 'commander'
import logger from 'npmlog'
import { run } from './run'

logger.heading = 'beholder'

const stdin = process.openStdin()

let data = ''

stdin.on('data', chunk => (data += chunk))

stdin.on('end', () => {
  program
    .option('-t, --target [target]', 'Check target')
    .option('-v, --verbose', 'Verbose output')
    .parse(process.argv)

  if (program.verbose) {
    logger.level = 'verbose'
  }

  run({ target: program.target }, data)
    .then(response => logger.info(response.message))
    .catch(error => {
      logger.error(error.message)
      process.exit(1)
    })
})
