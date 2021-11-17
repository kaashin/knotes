import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import axios from "axios";
import clog from "clog";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Credentials({
      name: "Credentials",
      credentials: {
        username: {
          label: "Email",
          type: "text",
          placeholder: "Email Address",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const response = await getUser(credentials);
        const { user } = response;

        if (user) {
          // Any object returned will be saved in 'user' property of the JWT
          return user;
        } else {
          // Returning false or null will be rejected
          return null;
        }
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn(user, account, profile) {
      return user;
    },
    async redirect(url, baseUrl) {
      return `${baseUrl}`;
    },
    async session(session, token) {
      console.log({ token });
      session.user.role = token?.role;
      session.user.userId = token?.userId;
      return session;
    },
    async jwt(token, user, account, profile, isNewUser) {
      console.log({ user });
      if (profile) {
        token.role = profile.role;
        token.userId = profile.id;
      }

      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      return token;
    },
  },
});

async function getUser(credentials) {
  return new Promise(async (resolve, reject) => {
    console.log(credentials);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/authEmail`,
        {
          email: credentials.username,
          password: credentials.password,
        }
      );

      clog.info("Retrieved user from database");
      clog.info("From getUser(): ", response.data);
      resolve(response.data);
    } catch (error) {
      clog.error(error);
      reject(error);
    }
  });
}
