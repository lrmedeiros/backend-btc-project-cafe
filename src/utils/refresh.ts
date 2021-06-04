import { sign, verify } from 'jsonwebtoken';

interface PayloadData {
  iat: number;
  exp: number;
  nbf: number;
  jti: number;
}

export function refresh(token: string) {
  const payload = verify(token, this.secretOrPublicKey) as PayloadData;
  delete payload.iat;
  delete payload.exp;
  delete payload.nbf;
  delete payload.jti; //We are generating a new token, if you are using jwtid during signing, pass it in refreshOptions
  // The first signing converted all needed options into claims, they are already in the payload
  return sign(payload, this.secretOrPrivateKey);
}
