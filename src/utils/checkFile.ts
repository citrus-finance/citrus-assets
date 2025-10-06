import { existsSync } from "fs";

// TODO: handle ipfs
export default async function checkFile(url: string): Promise<boolean> {
  if (url.startsWith("https://raw.githubusercontent.com/")) {
    const [org, repo, _branch, ...path] = url
      .replace("https://raw.githubusercontent.com/", "")
      .split("/");

    const localSrc = `.cache/${org}/${repo}/${path.join("/")}`;

    if (existsSync(localSrc)) {
      return true;
    }
  }

  return await checkRemoteFile(url);
}

async function checkRemoteFile(url: string): Promise<boolean> {
  try {
    console.log("Checking", url);

    const res = await fetch(url);

    if (res.status !== 200) {
      console.log("Failed to check", url);
      return false;
    }

    let fileExt = res.headers.get("content-type")?.split("/")[1];

    if (!fileExt) {
      return false;
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
      return false;
    }

    return true;
  } catch {
    console.log("Failed to check", url);
    return false;
  }
}
