// convert every function in an API to a voice command for annyang
function apiToCommands(api) {
  const unCamelCase = word => word.replace(/([A-Z])/g, ' $1').trim();

  const getArgs = fcn => fcn.length ? ' *args' : '';

  const log = f => (...args) => logAndReturn(f(...args))

  const appendText = (msg) => {
    const cmdHistory = document.getElementById('cmdHistory');
    if (cmdHistory && msg != null) cmdHistory.value += '\n' + (msg.text || msg.name || msg);
    return msg;
  };
  const logAndReturn = msg => { console.log(msg); appendText(msg); return msg; }

  var cmds = {};

  for (const f in api) {
    if (typeof api[f] === 'function') cmds[unCamelCase(f) + getArgs(api[f])] = log(api[f].bind(api));
  }

  if (!cmds['help']) cmds.help = () => console.log(Object.keys(cmds))
  
  if (annyang) annyang.addCommands(cmds);

  return cmds;
}
