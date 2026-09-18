import Navbar from "@/components/navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="mt-20">
        <h1 className="text-2xl text-gray-900 font-bold">404 Not Found 🧑‍🚀</h1>
        <div className="text-neutral-700 text-justify leading-7 mt-2">
          <p>Sorry, the page you are looking for does not exist.</p>
        </div>
      </div>
    </>
  );
}
