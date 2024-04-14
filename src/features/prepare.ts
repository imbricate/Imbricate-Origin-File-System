/**
 * @author WMXPY
 * @namespace Features
 * @description Prepare
 */

import { IImbricateOrigin, SandboxFeature } from "@imbricate/core";
import { createCreatePageFeature } from "./create-page";
import { createQueryPagesFeature } from "./query-pages";
import { createQueryScriptsFeature } from "./query-scripts";
import { createSearchPagesFeature } from "./search-pages";
import { createSearchScriptsFeature } from "./search-scripts";

export const prepareFileSystemFeatures = (
    origin: IImbricateOrigin,
): SandboxFeature[] => {

    const originFeatures: SandboxFeature[] = [
        createCreatePageFeature(origin),
        createQueryPagesFeature(origin),
        createQueryScriptsFeature(origin),
        createSearchPagesFeature(origin),
        createSearchScriptsFeature(origin),
    ];

    return originFeatures;
};
