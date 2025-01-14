/**
 * @author WMXPY
 * @namespace Origin
 * @description Search
 */

import { IImbricateDatabaseManager, IImbricateTextManager, IMBRICATE_PROPERTY_TYPE, IMBRICATE_SEARCH_TARGET_TYPE, ImbricateDatabaseManagerQueryDatabasesOutcome, ImbricateDatabaseQueryDocumentsOutcome, ImbricateOriginSearchOutcome, ImbricateSearchItem, ImbricateTextGetContentOutcome, ImbricateTextManagerGetTextOutcome, S_Origin_Search_Unknown, findPrimaryProperty } from "@imbricate/core";

export const performSearch = async (
    keyword: string,
    originUniqueIdentifier: string,
    databaseManager: IImbricateDatabaseManager,
    textManager: IImbricateTextManager,
): Promise<ImbricateOriginSearchOutcome> => {

    const keywordRegex: RegExp = new RegExp(keyword, "i");

    const databases: ImbricateDatabaseManagerQueryDatabasesOutcome = await databaseManager.queryDatabases({});

    if (typeof databases === "symbol") {
        return S_Origin_Search_Unknown;
    }

    const items: ImbricateSearchItem[] = [];

    for (const database of databases.databases) {

        const documents: ImbricateDatabaseQueryDocumentsOutcome = await database.queryDocuments({});

        if (typeof documents === "symbol") {
            continue;
        }

        for (const document of documents.documents) {

            const propertyKeys: string[] = Object.keys(document.properties);
            properties: for (const propertyKey of propertyKeys) {

                const property = document.properties[propertyKey];

                if (property.type === IMBRICATE_PROPERTY_TYPE.MARKDOWN) {

                    if (typeof property.value === "string") {

                        const text: ImbricateTextManagerGetTextOutcome = await textManager.getText(property.value);

                        if (typeof text === "symbol") {
                            continue properties;
                        }

                        const textContent: ImbricateTextGetContentOutcome = await text.text.getContent();

                        if (typeof textContent === "symbol") {
                            continue properties;
                        }

                        const lines = textContent.content.split("\n");

                        for (let i = 0; i < lines.length; i++) {

                            const line = lines[i];

                            if (keywordRegex.test(line)) {

                                const documentPrimaryKey = findPrimaryProperty(
                                    database.schema,
                                    document.properties,
                                );

                                items.push({
                                    target: {
                                        type: IMBRICATE_SEARCH_TARGET_TYPE.MARKDOWN,
                                        target: {
                                            originUniqueIdentifier,
                                            databaseUniqueIdentifier: database.uniqueIdentifier,
                                            documentUniqueIdentifier: document.uniqueIdentifier,
                                            propertyUniqueIdentifier: propertyKey,
                                            lineNumber: i + 1,
                                        },
                                    },
                                    primary: documentPrimaryKey ? String(documentPrimaryKey.value) : line,
                                    sourceDatabaseName: database.databaseName,
                                    sourceDocumentPrimaryKey: documentPrimaryKey ? String(documentPrimaryKey.value) : undefined,
                                    secondaryPrevious: lines[i - 1] ? [lines[i - 1]] : [],
                                    secondary: line,
                                    secondaryNext: lines[i + 1] ? [lines[i + 1]] : [],
                                });

                                continue properties;
                            }
                        }
                    }

                    continue properties;
                }

                if (property.type === IMBRICATE_PROPERTY_TYPE.STRING) {

                    if (typeof property.value === "string") {

                        if (keywordRegex.test(property.value)) {

                            items.push({
                                target: {
                                    type: IMBRICATE_SEARCH_TARGET_TYPE.DOCUMENT,
                                    target: {
                                        originUniqueIdentifier,
                                        databaseUniqueIdentifier: database.uniqueIdentifier,
                                        documentUniqueIdentifier: document.uniqueIdentifier,
                                    },
                                },
                                primary: property.value,
                                secondary: property.value,
                            });
                        }
                    }

                    continue properties;
                }
            }
        }
    }

    return {
        items,
    };
};
