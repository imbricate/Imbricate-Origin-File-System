/**
 * @namespace Property
 * @description Property
 */

import { IImbricateProperty, IMBRICATE_PROPERTY_TYPE, ImbricatePropertyKey, ImbricatePropertyRecord } from "@imbricate/core";
import { ImbricateFileSystemDocumentInstanceProperty, ImbricateFileSystemDocumentInstancePropertyRecord } from "../document/definition";
import { ImbricateFileSystemProperty } from "./property";

export const propertyRecordToInstanceRecord = (propertyRecord: ImbricatePropertyRecord): ImbricateFileSystemDocumentInstancePropertyRecord => {

    return Object.entries(propertyRecord).reduce((
        property: ImbricateFileSystemDocumentInstancePropertyRecord,
        [key, value]: [ImbricatePropertyKey, IImbricateProperty<IMBRICATE_PROPERTY_TYPE>],
    ) => {

        property[key] = {
            type: value.propertyType,
            value: value.propertyValue,
        };

        return property;
    }, {} as ImbricateFileSystemDocumentInstancePropertyRecord);
};

export const instanceRecordToPropertyRecord = (instanceRecord: ImbricateFileSystemDocumentInstancePropertyRecord): ImbricatePropertyRecord => {

    return Object.entries(instanceRecord).reduce((
        property: ImbricatePropertyRecord,
        [key, value]: [ImbricatePropertyKey, ImbricateFileSystemDocumentInstanceProperty],
    ) => {

        property[key] = ImbricateFileSystemProperty.create(
            key,
            value.type,
            value.value,
        );

        return property;
    }, {} as ImbricatePropertyRecord);
};

