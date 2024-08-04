/**
 * @author WMXPY
 * @namespace Util
 * @description Encode
 */

export const encodeFileSystemObject = (input: Record<string, any>): string => {

    return Buffer.from(JSON.stringify(input), "utf-8").toString("base64url");
};

export const decodeFileSystemObject = (input: string): Record<string, any> => {

    const buffer: Buffer = Buffer.from(input, "base64url");
    return JSON.parse(buffer.toString("utf-8"));
};

export const encodeFileSystemComponent = (input: string): string => {

    const buffer: Buffer = Buffer.from(input, "utf-8");
    return buffer.toString("base64url");
};

export const decodeFileSystemComponent = (input: string): string => {

    const buffer: Buffer = Buffer.from(input, "base64url");
    return buffer.toString("utf-8");
};
