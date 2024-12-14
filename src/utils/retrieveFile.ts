import { createWriteStream, existsSync } from "fs";
import { copyFile, mkdir } from "fs/promises";
import { dirname, extname } from "path";
import { Readable } from "stream";
import { finished } from "stream/promises";

// TODO: handle ipfs
export default async function retrieveFile(
  src: string,
  dest: string,
): Promise<string | null> {
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
        const fileExt = extname(localSrc).slice(1);

        console.log("Copying", localSrc);
        await copyFile(localSrc, `${dest}.${fileExt}`);
        return fileExt;
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

async function downloadFile(url: string, dest: string): Promise<string | null> {
  try {
    console.log("Downloading", url);

    const res = await fetch(url);

    if (res.status !== 200) {
      console.log("Failed to download", url);
      return null;
    }

    let fileExt = res.headers.get("content-type")?.split("/")[1];

    if (!fileExt) {
      return null;
    }

    switch (fileExt) {
      case "svg+xml": {
        fileExt = "svg";
      }
      case "x-icon": {
        fileExt = "ico";
      }
    }

    if (fileExt.includes(" ") || fileExt.includes("-")) {
      console.log(`Invalid file extension for ${url}`);
      return null;
    }

    const fileStream = createWriteStream(`${dest}.${fileExt}`);

    await finished(Readable.fromWeb(res.body!).pipe(fileStream));
    return fileExt;
  } catch {
    console.log("Failed to download", url);
    return null;
  }
}
