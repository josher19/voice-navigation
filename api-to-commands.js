// convert every function in an API to a voice command for annyang
function apiToCommands(api) {
  const unCamelCase = word => word.replace(/([A-Z])/g, ' $1').trim();

  const getArgs = fcn => fcn.length ? ' *args' : '';

  const log = f => (...args) => logAndReturn(f(...args))

  const logAndReturn = msg => { console.log(msg); return msg; }

  var cmds = {};

  for (const f in api) {
    if (typeof api[f] === 'function') cmds[unCamelCase(f) + getArgs(api[f])] = log(api[f].bind(api));
  }

  if (!cmds['help']) cmds.help = () => console.log(Object.keys(cmds))
  
  if (annyang) annyang.addCommands(cmds);

  return cmds;
}
