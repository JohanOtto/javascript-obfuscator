import { assert } from 'chai';

import { IObfuscationResult } from '../../../../src/interfaces/IObfuscationResult';

import { NO_CUSTOM_NODES_PRESET } from '../../../../src/options/presets/NoCustomNodes';

import { readFileAsString } from '../../../helpers/readFileAsString';

import { JavaScriptObfuscator } from '../../../../src/JavaScriptObfuscator';

describe('StringArrayNode', () => {
    const regExp: RegExp = /^var _0x([a-f0-9]){4} *= *\[/;

    describe('`stringArray` option is set', () => {
        let obfuscatedCode: string;

        before(() => {
            let obfuscationResult: IObfuscationResult = JavaScriptObfuscator.obfuscate(
                readFileAsString(__dirname + '/fixtures/simple-input.js'),
                {
                    ...NO_CUSTOM_NODES_PRESET,
                    stringArray: true,
                    stringArrayThreshold: 1
                }
            );

            obfuscatedCode = obfuscationResult.getObfuscatedCode();
        });

        it('should correctly append custom node into the obfuscated code', () => {
            assert.match(obfuscatedCode, regExp);
        });
    });

    it('should correctly append `StringArrayNode` custom node into the obfuscated code if `stringArray` option is set', () => {
        let obfuscationResult: IObfuscationResult = JavaScriptObfuscator.obfuscate(
            readFileAsString(__dirname + '/fixtures/simple-input.js'),
            {
                ...NO_CUSTOM_NODES_PRESET,
                stringArray: true,
                stringArrayThreshold: 1
            }
        );

        assert.match(obfuscationResult.getObfuscatedCode(), /^var _0x([a-f0-9]){4} *= *\[/);
    });

    it('should\'t append `StringArrayNode` custom node into the obfuscated code if `stringArray` option is not set', () => {
        let obfuscationResult: IObfuscationResult = JavaScriptObfuscator.obfuscate(
            readFileAsString(__dirname + '/fixtures/simple-input.js'),
            {
                ...NO_CUSTOM_NODES_PRESET,
                stringArray: false
            }
        );

        assert.notMatch(obfuscationResult.getObfuscatedCode(), /^var _0x([a-f0-9]){4} *= *\[/);
    });
});
