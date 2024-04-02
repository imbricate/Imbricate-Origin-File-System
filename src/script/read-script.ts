/**
 * @author WMXPY
 * @namespace FileSystem_Script
 * @description Read Script
 */

import { readTextFile } from "@sudoo/io";
import { getScriptsFolderPath } from "../util/path-joiner";
import { ensureScriptFolders, fixScriptFileName } from "./common";

export const fileSystemOriginReadScript = async (
    basePath: string,
    identifier: string,
): Promise<string> => {

    await ensureScriptFolders(basePath);

    const scriptFileName: string = fixScriptFileName(identifier);
    const scriptFolderPath: string = getScriptsFolderPath(basePath, scriptFileName);

    const scriptContent = await readTextFile(scriptFolderPath);

    return scriptContent;
};
