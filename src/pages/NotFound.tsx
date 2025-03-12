
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-crm-blue mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="bg-crm-blue hover:bg-crm-blue/90">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
