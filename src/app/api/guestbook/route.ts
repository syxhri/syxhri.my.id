import { getServerSession } from "next-auth";
import { authConfig } from "../../../../auth.config";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { make } from "simple-body-validator";
import ratelimit from "@/lib/ratelimit";

const limiter = ratelimit({
    interval: 15 * 60 * 1000,
    uniqueTokenPerInterval: 500,
});

export async function GET() {
    let client = await db;
    let conn = client.db();

    let guestbook = conn.collection("guestbook");
    let data = (await guestbook.find({}, { projection: { _id: 0 } }).toArray()).reverse();

    return NextResponse.json({ data })
}

export async function POST(req: Request) {
    const session = await getServerSession(authConfig);
    if(!session) return NextResponse.json({ errors: { message: ["Unauthorized."] } }, { status: 401 });

    const body = await req.json();
    const validator = make(body, {
        message: 'required|max:150'
    });

    if (!validator.validate()) return NextResponse.json({ errors: validator.errors().all() }, { status: 400 })

    try {
        await limiter.check(new NextResponse(), 3, "CACHE_TOKEN");

        try {
            let client = await db;
            let conn = client.db();
        
            let guestbook = conn.collection("guestbook");
            let toinsert = {
                content: body.message,
                timestamp: Date.now(),
                user: { name: session?.user?.name },
            };
    
            await guestbook.insertOne(toinsert);
            return NextResponse.json({ message: "Message sent successfully!", toast: { type: "success" } });
        } catch {
            return NextResponse.json({ errors: { message: ["Failed to send message."] } }, { status: 500 });
        }
    } catch {
        return NextResponse.json({ errors: { message: ["Rate limited. Try again in 15 minutes."] } }, { status: 429 });
    }
}