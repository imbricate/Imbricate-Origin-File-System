/**
 * @author WMXPY
 * @namespace Database
 * @description Query
 */

import { IImbricateDocument, ImbricateDatabaseSchema, ImbricateDocumentQuery } from "@imbricate/core";
import { getDocumentList } from "../document/action";
import { ImbricateFileSystemDocumentInstance } from "../document/definition";
import { ImbricateFileSystemDocument } from "../document/document";

export const queryDocuments = async (
    basePath: string,
    databaseUniqueIdentifier: string,
    schema: ImbricateDatabaseSchema,
    query: ImbricateDocumentQuery,
): Promise<IImbricateDocument[]> => {

    const documents: ImbricateFileSystemDocumentInstance[] = await getDocumentList(
        basePath,
        databaseUniqueIdentifier,
        query,
    );

    const results: IImbricateDocument[] = [];

    for (const documentInstance of documents) {

        const document = ImbricateFileSystemDocument.fromInstance(
            schema,
            basePath,
            databaseUniqueIdentifier,
            documentInstance,
        );

        results.push(document);
    }

    return results;
};
