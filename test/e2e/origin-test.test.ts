/**
 * @author WMXPY
 * @namespace OriginTest
 * @description Origin Test
 * @override E2E
 */

import { ImbricateOriginTestingTarget, startImbricateOriginTest } from "@imbricate/test-origin-jest";
import { FileSystemImbricateOrigin } from "../../src";

const testingTarget = ImbricateOriginTestingTarget.fromConstructor(
    async () => {

        const origin: FileSystemImbricateOrigin = await FileSystemImbricateOrigin.withPayloads(
        );
        return origin;
    },
);

startImbricateOriginTest(testingTarget);
