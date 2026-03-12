import { NextResponse, NextRequest } from "next/server";

export function proxy(request: NextRequest) {
	const isAuthenticated = false; //replace this with actual auth stuff
	
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