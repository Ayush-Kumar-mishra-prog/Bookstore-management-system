const LoginLeftSide = () => {
  return (
    <div className="hidden shrink-0 select-none flex-col justify-between bg-indigo-700 p-12 lg:flex lg:w-2/5">
      <div className="flex items-center gap-3">
        <div className="grid h-14 w-14 place-items-center rounded-lg bg-white text-2xl font-bold text-indigo-700">
          B
        </div>
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
