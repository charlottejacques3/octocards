import { NextResponse, NextRequest } from "next/server";
import { loginStatus } from "./app/api/auth";
import { URL_BASE } from "./lib/definitions";

export async function proxy(request: NextRequest) {

	const cookie = request.headers.get('cookie');
	const isAuthenticated = cookie ? await loginStatus(cookie) : false;
	
	if (!isAuthenticated) {
		return NextResponse.redirect(new URL("/login", request.url));
	} 
	else if (request.url === `${URL_BASE}login` || request.url === `${URL_BASE}signup`) {
		return NextResponse.redirect(new URL("/", request.url));
	}
	
	return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)',
  ],
};