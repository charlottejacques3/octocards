import { NextResponse, NextRequest } from "next/server";
import { login, loginStatus } from "./api/auth";

export async function proxy(request: NextRequest) {

	const cookie = request.headers.get('cookie');
	const isAuthenticated = cookie ? await loginStatus(cookie) : false;
	
	if (!isAuthenticated) {
		return NextResponse.redirect(new URL("/login", request.url));
	}
	
	return NextResponse.next();
}

export const config = {
  matcher: [
    // protect all routes except API routes, static files, and the login and signup pages themselves
    '/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)',
  ],
};