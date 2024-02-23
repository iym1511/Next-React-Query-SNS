import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const  {
  handlers: {GET,POST},
  auth,
  signIn,
} = NextAuth({

});