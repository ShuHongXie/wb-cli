const loadConfigFile = require('rollup/loadConfigFile');
const path = require('path');
const rollup = require('rollup');


loadConfigFile(path.resolve(__dirname, 'config.js'), { format: 'es' }).then(
  async ({ options, warnings }) => {
    console.log(`We currently have ${warnings.count} warnings`);

    // This prints all deferred warnings
    warnings.flush();

    // options is an array of "inputOptions" objects with an additional "output"
    // property that contains an array of "outputOptions".
    // The following will generate all outputs for all inputs, and write them to disk the same
    // way the CLI does it:
    for (const optionsObj of options) {
      console.log(optionsObj);
      const bundle = await rollup.rollup(optionsObj);
      await Promise.all(optionsObj.output.map(bundle.write));
    }

    // You can also pass this directly to "rollup.watch"
    // rollup.watch(options);
  }
);
