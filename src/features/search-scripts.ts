/**
 * @author WMXPY
 * @namespace Features
 * @description Search Scripts
 */

import { IImbricateOrigin, ImbricateScriptSearchResult, SandboxFeature, SandboxFeatureBuilder } from "@imbricate/core";

type SearchScriptsInput = {

    readonly keyword: string;

    readonly exact?: boolean;
    readonly limit?: number;
};

type SearchScriptsOutput = {

    readonly results: ImbricateScriptSearchResult[];
};

const createImplementation = (
    origin: IImbricateOrigin,
) => {

    return async (
        input: SearchScriptsInput,
    ): Promise<SearchScriptsOutput> => {

        if (typeof input.keyword !== "string") {
            throw new Error("Keyword is required");
        }

        const searchResults: ImbricateScriptSearchResult[] =
            await origin.searchScripts(input.keyword, {
                exact: Boolean(input.exact),
                limit: input.limit,
            });

        return {
            results: searchResults,
        };
    };
};

export const createSearchScriptsFeature = (
    origin: IImbricateOrigin,
): SandboxFeature => {

    return SandboxFeatureBuilder.providedByOrigin()
        .withPackageName("script")
        .withMethodName("searchScripts")
        .withImplementation(createImplementation(origin))
        .build();
};
