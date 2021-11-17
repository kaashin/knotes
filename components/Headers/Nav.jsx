import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";
import { Button } from "@chakra-ui/react";

export default function Nav(props) {
  const [session, loading] = useSession();
  console.log({ session });
  return (
    <>
      <style jsx>{``}</style>
      <div className="flex flex-row w-100 justify-between items-center">
        <div>
          <Link href="/">Blitz Notion</Link>
        </div>
        <div>
          {!session && (
            <>
              <Button
                className="adminButton"
                onClick={() => signIn()}
                data-cy="loginBtn"
              >
                Login
              </Button>
            </>
          )}
          {session && (
            <>
              <div className="tr">
                <p className="ma0">Signed in as {session.user.email}</p>
                <p className="ma0">
                  <Link href="/user/settings">
                    <a className="mh1">Settings</a>
                  </Link>

                  <a
                    className="ml1"
                    href="#"
                    onClick={() =>
                      signOut({
                        callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}`,
                      })
                    }
                  >
                    Sign out
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
