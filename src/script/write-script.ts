/**
 * @author WMXPY
 * @namespace FileSystem_Script
 * @description Write Script
 */

import { writeTextFile } from "@sudoo/io";
import { getScriptsFolderPath } from "../util/path-joiner";
import { ensureScriptFolders, fixScriptFileName } from "./common";

export const fileSystemOriginWriteScript = async (
    basePath: string,
    identifier: string,
    content: string,
): Promise<void> => {

    await ensureScriptFolders(basePath);

    const scriptFileName: string = fixScriptFileName(identifier);
    const scriptFolderPath: string = getScriptsFolderPath(basePath, scriptFileName);

    await writeTextFile(scriptFolderPath, content);
};
