import { Link } from "react-router-dom";
import LoginLeftSide from "../components/LoginLeftSide";
import { ArrowRightIcon, ShieldIcon, ShoppingBagIcon } from "lucide-react";

const LoginPage = () => {
  const portalOptions = [
    {
      to: "/customer-login",
      title: "Customer Portal",
      description: "Browse books, manage your cart, and place orders.",
      icon: ShoppingBagIcon,
    },
    {
      to: "/admin-login",
      title: "Admin Portal",
      description: "Manage inventory, customer orders, and bookstore operations.",
      icon: ShieldIcon,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginLeftSide />

      <div className="w-full md:w-1/2 flex min-h-screen flex-col items-center justify-center overflow-y-auto p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-10 text-center md:text-left">
            <h2 className="font-heading mb-3 text-3xl font-medium tracking-tight text-slate-900">
              Welcome Back
            </h2>
            <p className="font-subheading text-slate-500">
              Select your portal to securely access the bookstore system.
            </p>
          </div>

          <div className="space-y-4">
            {portalOptions.map((portal) => {
              const Icon = portal.icon;
              return (
                <Link
                  key={portal.to}
                  to={portal.to}
                  className="group block rounded-lg border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-50 sm:p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="rounded-md bg-white p-2 text-indigo-600 shadow-sm">
                        <Icon size={20} />
                      </span>
                      <div>
                        <h3 className="font-subheading text-lg text-slate-800 transition-colors group-hover:text-indigo-600">
                          {portal.title}
                        </h3>
                        <p className="text-sm text-slate-500">{portal.description}</p>
                      </div>
                    </div>
                    <ArrowRightIcon className="h-4 w-4 text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-indigo-600" />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 text-center text-sm text-slate-400 md:text-left">
            Copyright {new Date().getFullYear()} Bookstore Management System
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
