import { authMiddleware, redirectToSignIn } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default authMiddleware({
    async afterAuth(auth,request){
        if (!auth.userId && !auth.isPublicRoute){
            return redirectToSignIn({returnBackUrl:request.url})
        }
        return NextResponse.next();
    }
});



// import { clerkMiddleware } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export default clerkMiddleware({
//   async afterAuth(auth, request) {
//     // Check if the user is not authenticated and the route is not public
//     if (!auth.userId && !auth.isPublicRoute) {
//       // Construct the sign-in URL
//       const signInUrl = new URL("/sign-in", request.nextUrl.origin);
//       // Add the return URL (where to go back after signing in)
//       signInUrl.searchParams.set("returnBackUrl", request.nextUrl.href);
//       // Redirect the user to the sign-in page with the returnBackUrl
//       return NextResponse.redirect(signInUrl);
//     }
//     // Allow access to the route if authenticated or the route is public
//     return NextResponse.next();
//   },
// });



// import { clerkMiddleware} from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export default clerkMiddleware({
// //   async afterAuth(auth: AuthObject, request: NextRequest) {
// //     if (!auth.userId && !auth.isPublicRoute) {
// //       const signInUrl = new URL("/sign-in", request.nextUrl.origin);
// //       signInUrl.searchParams.set("returnBackUrl", request.nextUrl.href);
// //       return NextResponse.redirect(signInUrl);
// //     }
// //     return NextResponse.next();
// //   },
// });



export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
