const unCamelCase = word => word.replace(/([A-Z])/g, ' $1').trim();

const getArgs = fcn => fcn.length ? ' *args' : '';

// convert every function in an API to a voice command for annyang
const apiToCommands(api) {
  var cmds = {};

  for (const f in api) {
    if (typeof api[f] === 'function') cmds[unCamelCase(f) + getArgs(api[f])] = api[f].bind(api);
  }

  if (annyang) annyang.addCommands(cmds);

  return cmds;
}
