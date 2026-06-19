import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CryptoService {
    private readonly publicKey: string;
    private readonly privateKey: string;

    constructor() {
        this.publicKey = fs.readFileSync(
            path.join(process.cwd(), 'keys', 'public.pem'),
            'utf8',
        );

        this.privateKey = fs.readFileSync(
            path.join(process.cwd(), 'keys', 'private.pem'),
            'utf8',
        );
    }

    encrypt(data: any): string {
        const encrypted = crypto.publicEncrypt(
            this.publicKey,
            Buffer.from(JSON.stringify(data)),
        );
        return `ENC:${encrypted.toString('base64')}`;
        // return encrypted.toString('base64');
    }

    decrypt(encryptedData: string): any {
        const actualEncryptedData = encryptedData.replace('ENC:', '');
        const decrypted = crypto.privateDecrypt(
            this.privateKey,
            Buffer.from(actualEncryptedData, 'base64'),
        );
        return JSON.parse(decrypted.toString());
    }
}