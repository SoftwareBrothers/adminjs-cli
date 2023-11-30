import shell from 'child_process';

export const asyncExec = (
  command: string,
  opts: shell.ExecSyncOptionsWithBufferEncoding,
) => new Promise((resolve, reject) => {
  setTimeout(() => {
    try {
      const result = shell.execSync(command, opts);

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
});
