import shell from 'child_process';
import path from 'path';

const asyncExec = (command, opts) => new Promise((resolve, reject) => {
  setTimeout(() => {
    try {
      const result = shell.execSync(command, opts);

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
});

const postsetup = async (promptsResponse, driversInfo) => {
  const { projectName, packageManager } = promptsResponse;
  const { dialectName } = driversInfo;

  const cwd = path.join(process.cwd(), projectName);

  const install = packageManager === 'npm'
    ? 'npm install'
    : 'yarn add';

  await asyncExec(`${install} @mikro-orm/${dialectName}`, { cwd, stdio: [0, 1, 2] });
};

export default postsetup;
