import { execa } from "execa";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";

export async function gitPull(url: string) {
  const name = url.split(":")[1].replace(".git", "");

  if (!existsSync(".cache")) {
    await mkdir(".cache");
  }

  if (!existsSync(`.cache/${name}`)) {
    console.log(`Cloning ${url}`);
    await execa({
      stdout: "inherit",
      stderr: "inherit",
      cwd: ".cache",
    })`git clone --depth 1 ${url} ${name}`;
  }

  console.log(`Updating ${url}`);
  await execa({
    stdout: "inherit",
    stderr: "inherit",
    cwd: `.cache/${name}`,
  })`git pull`;

  const { stdout: branch } = await execa({
    cwd: `.cache/${name}`,
  })`git rev-parse --abbrev-ref HEAD`;

  return {
    remoteDir: name,
    dir: `.cache/${name}`,
    branch,
  };
}
