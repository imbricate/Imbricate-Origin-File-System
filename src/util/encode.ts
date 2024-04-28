/**
 * @author WMXPY
 * @namespace Util
 * @description Encode
 */

export const encodeFileSystemComponent = (input: string): string => {

    const buffer: Buffer = Buffer.from(input, "utf-8");
    return buffer.toString("base64url");
};

export const decodeFileSystemComponent = (input: string): string => {

    const buffer: Buffer = Buffer.from(input, "base64url");
    return buffer.toString("utf-8");
};
