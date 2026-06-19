import * as crypto from 'crypto';
import * as fs from 'fs';

if (!fs.existsSync('keys')) {
  fs.mkdirSync('keys');
}

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

fs.writeFileSync(
  'keys/public.pem',
  publicKey.export({
    type: 'pkcs1',
    format: 'pem',
  }),
);

fs.writeFileSync(
  'keys/private.pem',
  privateKey.export({
    type: 'pkcs1',
    format: 'pem',
  }),
);

console.log('Keys generated successfully!');