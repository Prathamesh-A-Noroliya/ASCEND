import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const secret = process.env.SESSION_SECRET;

if (!secret) {
  throw new Error("SESSION_SECRET is not defined");
}

const secretKey = new TextEncoder().encode(secret);

export async function createToken(userId: string) {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function createSession(userId: string) {
  const token = await createToken(userId);
  const cookieStore = await cookies();

  cookieStore.set("ascend_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return token;
}

export async function getSessionUserId(request?: Request) {
  let token: string | undefined;

  const auth = request?.headers.get("authorization");

  if (auth?.startsWith("Bearer ")) {
    token = auth.slice(7);
  }

  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get("ascend_session")?.value;
  }

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey);

    if (typeof payload.userId !== "string") return null;

    return payload.userId;
  } catch {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();

  cookieStore.set("ascend_session", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
}
