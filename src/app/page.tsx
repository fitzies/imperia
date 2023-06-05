import { SignOutButton } from "@clerk/nextjs";

const Page = ({ params }: { params: { slug: string } }) => {
  return (
    <div className="w-screen h-screen bg-base-100">
      <SignOutButton />
    </div>
  );
};

export default Page;
