import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <ShieldAlert size={70} className="text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Access Denied
        </h1>

        <p className="text-gray-600 mb-6">
          You do not have permission to access this page.
          Only administrators can view this section.
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            to="/"
            className="px-5 py-2 bg-[#01796F] text-white rounded-lg hover:opacity-90"
          >
            Go Home
          </Link>

          <Link
            to="/shop"
            className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}