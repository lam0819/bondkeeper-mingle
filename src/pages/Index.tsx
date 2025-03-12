
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-3xl px-6 py-12 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-crm-blue to-crm-purple bg-clip-text text-transparent">
          BondKeeper
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your personal relationship management system. Keep track of your connections, never miss important dates, and nurture the relationships that matter most.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-crm-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-crm-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Manage Contacts</h3>
            <p className="text-gray-600">Store all your contacts in one place with detailed profiles and custom fields.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-crm-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-crm-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Never Miss Important Dates</h3>
            <p className="text-gray-600">Keep track of birthdays, anniversaries, and other important events.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-crm-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-crm-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Track Interactions</h3>
            <p className="text-gray-600">Log your conversations, meetings, and other interactions to maintain context.</p>
          </div>
        </div>
        
        <Link to="/dashboard">
          <Button size="lg" className="bg-crm-blue hover:bg-crm-blue/90 text-white font-semibold px-6">
            Get Started
          </Button>
        </Link>
      </div>
      
      <footer className="w-full py-6 text-center text-gray-500 text-sm">
        <p>BondKeeper - Personal CRM - Built with Cloudflare Pages</p>
      </footer>
    </div>
  );
};

export default Index;
