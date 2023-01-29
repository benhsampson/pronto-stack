import { signIn, signOut, useSession } from "next-auth/react";

const IndexPage = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <p>Signed in as {session.user?.name}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      <p>Not signed in</p>
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
};
export default IndexPage;
