import { assert } from 'chai';

import { IObfuscationResult } from '../../../../../../src/interfaces/IObfuscationResult';

import { NO_CUSTOM_NODES_PRESET } from '../../../../../../src/options/presets/NoCustomNodes';

import { readFileAsString } from '../../../../../helpers/readFileAsString';

import { JavaScriptObfuscator } from '../../../../../../src/JavaScriptObfuscator';

describe('BinaryExpressionControlFlowReplacer', () => {
    let obfuscatedCode: string;

    describe('replace (binaryExpressionNode: ESTree.BinaryExpression,parentNode: ESTree.Node,controlFlowStorage: IStorage <ICustomNode>)', () => {
        describe('variant #1 - single binary expression', () => {
            const controlFlowStorageCallRegExp: RegExp = /var *_0x([a-f0-9]){4,6} *= *_0x([a-f0-9]){4,6}\['\w{3}'\]\(0x1, *0x2\);/;

            before(() => {
                const obfuscationResult: IObfuscationResult = JavaScriptObfuscator.obfuscate(
                    readFileAsString(__dirname + '/fixtures/input-1.js'),
                    {
                        ...NO_CUSTOM_NODES_PRESET,
                        controlFlowFlattening: true,
                        controlFlowFlatteningThreshold: 1
                    }
                );

                obfuscatedCode = obfuscationResult.getObfuscatedCode();
            });

            it('should replace binary expression node by call to control flow storage node', () => {
                assert.match(obfuscatedCode, controlFlowStorageCallRegExp);
            });
        });

        describe('variant #2 - multiple binary expressions with threshold = 1', function () {
            this.timeout(60000);

            const samplesCount: number = 1000;
            const expectedValue: number = 0.5;
            const delta: number = 0.1;

            const controlFlowStorageCallRegExp1: RegExp = /var *_0x([a-f0-9]){4,6} *= *(_0x([a-f0-9]){4,6}\['\w{3}'\])\(0x1, *0x2\);/;
            const controlFlowStorageCallRegExp2: RegExp = /var *_0x([a-f0-9]){4,6} *= *(_0x([a-f0-9]){4,6}\['\w{3}'\])\(0x2, *0x3\);/;

            let equalsValue: number = 0,
                obfuscationResult: IObfuscationResult,
                firstMatchArray: RegExpMatchArray | null,
                secondMatchArray: RegExpMatchArray | null,
                firstMatch: string | undefined,
                secondMatch: string | undefined;

            it('should replace binary expression node by call to control flow storage node', () => {
                for (let i = 0; i < samplesCount; i++) {
                    obfuscationResult = JavaScriptObfuscator.obfuscate(
                        readFileAsString(__dirname + '/fixtures/input-2.js'),
                        {
                            ...NO_CUSTOM_NODES_PRESET,
                            controlFlowFlattening: true,
                            controlFlowFlatteningThreshold: 1
                        }
                    );

                    obfuscatedCode = obfuscationResult.getObfuscatedCode();

                    firstMatchArray = obfuscatedCode.match(controlFlowStorageCallRegExp1);
                    secondMatchArray = obfuscatedCode.match(controlFlowStorageCallRegExp2);

                    firstMatch = firstMatchArray ? firstMatchArray[2] : undefined;
                    secondMatch = secondMatchArray ? secondMatchArray[2] : undefined;

                    assert.match(obfuscatedCode, controlFlowStorageCallRegExp1);
                    assert.match(obfuscatedCode, controlFlowStorageCallRegExp2);

                    if (firstMatch === secondMatch) {
                        equalsValue++;
                    }
                }

                assert.closeTo(equalsValue / samplesCount, expectedValue, delta);
            });
        });
    });
});
