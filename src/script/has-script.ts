/**
 * @author WMXPY
 * @namespace FileSystem_Script
 * @description Has Script
 */

import { ImbricateScriptSnapshot } from "@imbricate/core";
import { fileSystemOriginListScripts } from "./list-scripts";

export const fileSystemOriginHasScript = async (
    basePath: string,
    scriptName: string,
): Promise<boolean> => {

    const scriptList: ImbricateScriptSnapshot[] =
        await fileSystemOriginListScripts(basePath);

    return scriptList.some((script: ImbricateScriptSnapshot) => {

        return script.scriptName === scriptName;
    });
};
