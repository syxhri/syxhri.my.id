import ratelimit from "@/lib/ratelimit";
import axios from "axios";
import { NextResponse } from "next/server";
import { make } from "simple-body-validator";

const limiter = ratelimit({
    interval: 60 * 60 * 1000,
    uniqueTokenPerInterval: 500,
});

export async function POST(req: Request) {
    const body = await req.json();
    const validator = make(body, {
        name: 'required',
        email: 'required|email',
        message: 'required|max:3500'
    });

    if (!validator.validate()) return NextResponse.json({ errors: validator.errors().all() }, { status: 400 })

    const { name, email, message } = body;
    const text = `— <b>${name}</b>%0A📧 <b>${email}</b>%0A%0A${message}`;

    try {
        await limiter.check(new NextResponse(), 3, "CACHE_TOKEN");

        try {
            await axios.get(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${process.env.TELEGRAM_CHAT_ID}&text=${text}&parse_mode=html`);
            return NextResponse.json({ message: "Message sent successfully!", toast: { type: "success" } });
        } catch {
            return NextResponse.json({ errors: { message: ["Failed to send message."] } }, { status: 500 });
        }
    } catch {
        return NextResponse.json({ errors: { message: ["To avoid spam, we limit to only 2 messages sent per ip in an hour."] } }, { status: 429 });
    }
}