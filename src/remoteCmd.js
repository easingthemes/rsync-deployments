const { join } = require('path');
const { exec } = require('child_process');

const { sshServer, githubWorkspace } = require('./inputs');
const { writeToFile } = require('./helpers');

const remoteCmd = (cmd, label) => {
  const localScriptPath = join(githubWorkspace, `local_ssh_script-${label}.sh`);
  try {
    writeToFile(localScriptPath, cmd);

    exec(`ssh ${sshServer} 'bash -s' < ${localScriptPath}`, (err, data, stderr) => {
      if (err) {
        console.log('⚠️ [CMD] Remote script failed. ', err.message);
      } else {
        console.log('✅ [CMD] Remote script executed. \n', data, stderr);
      }
    });
  } catch (err) {
    console.log('⚠️ [CMD] Starting Remote script execution failed. ', err.message);
  }
};

module.exports = {
  remoteCmdBefore: (cmd) => remoteCmd(cmd, 'before'),
  remoteCmdAfter: (cmd) => remoteCmd(cmd, 'after')
};