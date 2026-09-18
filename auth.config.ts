import { MongoDBAdapter } from '@auth/mongodb-adapter';
import GithubProvider from "next-auth/providers/github";
import db from '@/lib/db';
import { AuthOptions, getServerSession } from 'next-auth';
 
export const authConfig = {
    adapter: MongoDBAdapter(db),
    secret: process.env.NEXT_AUTH_SECRET,
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        })
    ],
} satisfies AuthOptions;

/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
export const getSession = () => getServerSession(authConfig)
