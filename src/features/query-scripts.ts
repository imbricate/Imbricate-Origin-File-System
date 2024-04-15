/**
 * @author WMXPY
 * @namespace Features
 * @description Query Scripts
 */

import { IImbricateOrigin, IImbricateScript, ImbricateScriptAttributes, SandboxFeature, SandboxFeatureBuilder } from "@imbricate/core";
import { FileSystemScriptMetadata } from "../script/definition";

type QueryScriptsInput = {

    readonly collection: string;

    readonly limit?: number;
};

type QueryScriptsOutput = {

    readonly scripts: FileSystemScriptMetadata[];
};

const createImplementation = (
    origin: IImbricateOrigin,
) => {

    return async (
        input: QueryScriptsInput,
    ): Promise<QueryScriptsOutput> => {

        const scripts: IImbricateScript[] = await origin.queryScripts({
        }, {
            limit: input.limit,
        });

        const results: FileSystemScriptMetadata[] = [];

        for (const script of scripts) {

            const attributes: ImbricateScriptAttributes = await script.readAttributes();

            results.push({

                scriptName: script.scriptName,
                identifier: script.identifier,

                description: script.description,

                createdAt: script.createdAt,
                updatedAt: script.updatedAt,

                attributes,
            });
        }

        return {
            scripts: results,
        };
    };
};

export const createQueryScriptsFeature = (
    origin: IImbricateOrigin,
): SandboxFeature => {

    return SandboxFeatureBuilder.providedByOrigin()
        .withPackageName("script")
        .withMethodName("queryScripts")
        .withImplementation(createImplementation(origin))
        .build();
};
