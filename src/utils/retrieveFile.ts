import { createWriteStream, existsSync } from "fs";
import { copyFile, mkdir } from "fs/promises";
import { dirname } from "path";
import { Readable } from "stream";
import { finished } from "stream/promises";

// TODO: handle ipfs
export default async function retrieveFile(
  src: string,
  dest: string,
): Promise<boolean> {
  await mkdir(dirname(dest), {
    recursive: true,
  });

  if (src.startsWith("https://raw.githubusercontent.com/")) {
    const [org, repo, _branch, ...path] = src
      .replace("https://raw.githubusercontent.com/", "")
      .split("/");

    const localSrc = `.cache/${org}/${repo}/${path.join("/")}`;

    if (existsSync(localSrc)) {
      try {
        console.log("Copying", localSrc);
        await copyFile(localSrc, dest);
        return true;
      } catch {
        console.log("Failed to copy", localSrc);
      }
    }
  }

  if (src.startsWith("ipfs://")) {
    return await downloadFile(
      src.replace("ipfs://", "https://ipfs.io/ipfs/"),
      dest,
    );
  }

  return await downloadFile(src, dest);
}

async function downloadFile(url: string, dest: string): Promise<boolean> {
  try {
    console.log("Downloading", url);

    const res = await fetch(url);

    if (res.status !== 200) {
      console.log("Failed to download", url);
      return false;
    }

    const fileStream = createWriteStream(dest);

    await finished(Readable.fromWeb(res.body!).pipe(fileStream));
    return true;
  } catch {
    console.log("Failed to download", url);
    return false;
  }
}
