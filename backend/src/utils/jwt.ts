import { JWTPayload, jwtVerify, JWTVerifyOptions, KeyLike, SignJWT, SignOptions } from "jose";

const EncryptionAlgorithm = "HS256";
const ExpirationTime = "2h";

export async function sign(payload: JWTPayload, secret: KeyLike | Uint8Array, options?: SignOptions) {
	const encrypter = new SignJWT(payload);
	encrypter.setProtectedHeader({ alg: EncryptionAlgorithm });
	encrypter.setIssuedAt();
	encrypter.setExpirationTime(ExpirationTime);
	return await encrypter.sign(secret, options);
}

export async function verify(jwt: string, secret: KeyLike | Uint8Array, options?: JWTVerifyOptions) {
	return await jwtVerify(jwt, secret, {
		requiredClaims: ["role", "userId"],
		...options,
	});
}
