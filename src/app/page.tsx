import { SignUp } from "@clerk/nextjs";

const Page = ({ params }: { params: { slug: string } }) => {
  return (
    <div className="w-screen h-screen bg-base-100">
      <button className="btn btn-secondary">hello</button>
      <SignUp />
    </div>
  );
};

export default Page;
