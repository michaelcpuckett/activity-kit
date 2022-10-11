import { ServiceAccount } from 'firebase-admin';

const serviceAccount = {
  type: 'service_account',
  project_id: 'socialweb-id',
  private_key_id: 'a80ec37ff2f96f01a5aa4177af90e090bb48343f',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC6dRuTSRujvUiR\npWlwwoqb/2yRpmLcLIg/kBbUBnRCYiwRHPvOtUwKFCgHXOqAuumZIC+yr84Cb0lI\nFCnRYUqqUYPBAi4uoUDNYJX16zGrTtSPLIdJoeuRPQ493RmRpXNK28Yz6VGCmEsl\nB3LdZ9ATMh5mnHx9I13uVStPG5X9YULU/vOpPwJRa7HRnvEixBP4cQMAUk+5nXpi\nQebryZ6/C2wOcD1JB8gFUegklLQ76BPZZK/U7Nh9u9nAzA5c5FMmmklv+nZxSpMR\nB7cBKXzgM/uoT4R8Vgh18vJpTnGktENDLA9US5wZrkQXwkzKEmuib1/Wv3rJEdON\noLuO4MJRAgMBAAECggEAD6G7wxhQ9zmU45OriFGMT1HAUgxR+MV0Ur02EhEhyWLz\nm30DkKvbCR6cJdSLWxQl0LmbEMRJECPbpUL+J9ib6uAp8edzObjjzD65s8PuW79L\nILRfTzQCTMstQ3si0UwT+LBTfeH5/GnfeuY/TK05tjJFzDJ4WVa6tugbA7x7UaJO\nCmpyNy3KTLltxbgou/2vEnx/glwqzeHW6PJYV2eJcVGmfg6xVFDR49YtxgeeZlC+\nD4XMKuEQuGhJ77+zcgIudCie7IOWDq/ejDsjDYNiZBKTiBkYTfnXe1tYM93Qf09p\nDwjZw39ElXfbChDcwZHKESMoUe68U1XKJQmNQLQKNQKBgQDt2vcTiubcXbQK1utw\n4XXe04MACuAnkZyQWlEOnGiqOsXjD5vF94147nPkAHkz8XZjpFMcH5R9d8rJ5DvM\nkN2/vBJwSPzSRBuPlJSNJfWVg+v0aBb8blQpF3a/zZ9Ih8RU8f70MHw6zTKO3wEh\ntFEu5EyMbdE2cgLX0djCMLMoUwKBgQDIrmcFXTrNmjVejPYT0zt1Y4JdhwzO9WN8\nDKKGAbKUFykzFziD6eS/+GBbMu/ap3Qb8zkiPMAbVsfnZrLt1WSQev1+LhiHueoz\nHZG3MMZKEhspZ0yQPIAyd49+DHSDd6yt63OMmCMO4yFm0vfMto30bt6/OxCMNwcm\nGFR0lIYGSwKBgQCQ/7s/np2+GSF4uiwtVESW4jop/HdJp+rZ1TU0wwTLQakBErLT\nrGYCIttjUyaQE9MoSzSfIGFVW4G0Mf6CZo3IJM7YxKXbSMnEbb9hjJJ540IkbJAW\nsut7YWJy6tb/UETPw/a4xhX1gsIfdrMp6NLU0zgXI5s2pao2BycsuqN9IQKBgCt1\nGPogZkt/yW7gN6mzZHzXP7PhOvTWTuTeF5PNak6HdXSK4sIuNEseDj+xmB9Rg+NJ\nmGXBohhJgqCprLW0MELZX2ujr8w0hnLrRFLXTRldMmSU6g+SCnDjUz+IkvKlR8+h\n3TPk/jKLHQCXTvIV1kfIepQOxlaW1AV7304fm6ZhAoGBAKIa5MUGzrK8SYGawwrV\nExDDr4oV/Fq9HZRMY0xWa2PshYEqGFB4FLc+rl6/SLTzxDehwYqXsqkLfqm2xjCf\nP1rFBnJsQhoxNQ1+b51sI+8dftrFJ7zEz7NAZ2YWtXqtu5gGyzf3qIeTkLxTpVTO\naqLRlxdKtEp0TMizftnlVl6R\n-----END PRIVATE KEY-----\n',
  client_email: 'firebase-adminsdk-o0j5x@socialweb-id.iam.gserviceaccount.com',
  client_id: '110281511136422720421',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-o0j5x%40socialweb-id.iam.gserviceaccount.com',
};

export default serviceAccount as ServiceAccount;
