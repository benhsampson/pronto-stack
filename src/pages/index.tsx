import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { trpc } from "../lib/trpc";

const IndexPage = () => {
  const { data: session } = useSession();
  const allUsers = trpc.users.getAll.useQuery();

  return (
    <>
      <ul>
        {allUsers.data?.map((user) => (
          <li key={user.id}>
            {user.image && (
              <Image
                src={user.image}
                alt={user.name || user.id}
                width={100}
                height={100}
              />
            )}
            <p>{user.name}</p>
          </li>
        ))}
      </ul>
      {session ? (
        <>
          <p>Signed in as {session.user?.name}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <>
          <p>Not signed in</p>
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
    </>
  );
};
export default IndexPage;
