const LoginLeftSide = () => {
  return (
    <div className="hidden shrink-0 select-none flex-col justify-between bg-indigo-700 p-12 lg:flex lg:w-2/5">
      <div className="flex items-center gap-3">
        <svg width="74" height="64" viewBox="0 0 74 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M38.643 30.188C38.643 13.516 52.158 0 68.83 0h4.83c0 16.673-13.516 30.188-30.188 30.188z" fill="#edb731"/><path d="M38.643 33.812C38.643 50.484 52.158 64 68.83 64h4.83c0-16.672-13.516-30.188-30.188-30.188z" fill="#7443fd"/><path d="M35.019 30.188C35.019 13.516 21.503 0 4.83 0H0c0 16.673 13.516 30.188 30.19 30.188z" fill="#ef345d"/><path d="M35.019 33.812C35.019 50.484 21.503 64 4.83 64H0c0-16.672 13.516-30.188 30.19-30.188z" fill="#0bdaac"/></svg>
        <span className="text-4xl font-medium text-white">
          Bookstore Management System
        </span>
      </div>
      <div>
        <h2 className="mb-3 text-3xl font-medium leading-snug tracking-tight text-white">
          Manage books, orders, and customers
        </h2>
        <p className="text-indigo-100">
          A MERN bookstore system with secure customer ordering and admin inventory control.
        </p>
        <p className="mt-12 text-sm text-indigo-100">
          Copyright {new Date().getFullYear()} Bookstore Management System
        </p>
      </div>
    </div>
  );
};

export default LoginLeftSide;
