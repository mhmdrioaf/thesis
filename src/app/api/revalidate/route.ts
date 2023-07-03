import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

async function handler(request: NextRequest) {
  // const secret = request.nextUrl.searchParams.get("secret");
  // if (secret !== process.env.SECRET_TOKEN) {
  //   return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  // }

  // TODO: Create a secret token for user who can revalidate the data

  const tag = request.nextUrl.searchParams.get("tag");

  try {
    if (tag) {
      revalidateTag(tag);
      return NextResponse.json({ revalidated: true, now: Date.now() });
    } else {
      return NextResponse.json({ revalidated: false, message: "No tag." });
    }
  } catch (err) {
    console.error(
      "An error occurred when revalidating marketplace data: ",
      err
    );
  }
}

export { handler as GET };
