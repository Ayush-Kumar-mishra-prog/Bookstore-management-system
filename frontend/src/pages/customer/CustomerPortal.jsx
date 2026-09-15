import { useEffect, useMemo, useState } from "react";
import { LogOutIcon, SearchIcon, ShoppingCartIcon } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch, getSessionUser } from "../../api";

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value) || 0);
}

export default function CustomerPortal() {
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const user = getSessionUser();

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart],
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : "";
      const [bookData, orderData] = await Promise.all([
        apiFetch(`books${query}`),
        apiFetch("orders"),
      ]);
      setBooks(bookData.books || []);
      setOrders(orderData.orders || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (book) => {
    if (book.stock < 1) {
      toast.error("This book is out of stock");
      return;
    }

    setCart((current) => {
      const existing = current.find((item) => item.bookId === book._id);
      if (existing) {
        return current.map((item) =>
          item.bookId === book._id
            ? { ...item, quantity: Math.min(item.quantity + 1, book.stock) }
            : item,
        );
      }
      return [
        ...current,
        {
          bookId: book._id,
          title: book.title,
          price: book.price,
          quantity: 1,
        },
      ];
    });
    toast.success("Added to cart");
  };

  const updateQuantity = (bookId, quantity) => {
    setCart((current) =>
      current
        .map((item) => (item.bookId === bookId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const checkout = async () => {
    if (!cart.length) {
      toast.error("Add at least one book to checkout");
      return;
    }

    setPlacingOrder(true);
    try {
      await apiFetch("orders", {
        method: "POST",
        body: JSON.stringify({ items: cart }),
      });
      setCart([]);
      toast.success("Order placed");
      await loadData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "#/login";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-medium text-indigo-600">Customer Portal</p>
            <h1 className="font-heading text-2xl font-semibold text-slate-950">
              Bookstore Management System
            </h1>
            <p className="text-sm text-slate-500">Signed in as {user?.name}</p>
          </div>
          <button className="btn-secondary inline-flex items-center gap-2" onClick={logout}>
            <LogOutIcon size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <section>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && loadData()}
                placeholder="Search by title, author, genre, or ISBN"
                className="pl-10"
              />
            </div>
            <button className="btn-primary" onClick={loadData}>
              Search
            </button>
          </div>

          {loading ? (
            <div className="card p-8 text-center text-slate-500">Loading books...</div>
          ) : books.length === 0 ? (
            <div className="card p-8 text-center text-slate-500">No books found.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {books.map((book) => (
                <article key={book._id} className="card flex flex-col overflow-hidden">
                  <div className="aspect-[4/3] bg-slate-100">
                    {book.imageUrl ? (
                      <img
                        src={book.imageUrl}
                        alt={book.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-400">
                        Book cover
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                        {book.genre}
                      </p>
                      <h2 className="mt-1 text-lg font-semibold text-slate-950">{book.title}</h2>
                      <p className="text-sm text-slate-500">by {book.author}</p>
                      <p className="mt-3 line-clamp-3 text-sm text-slate-600">
                        {book.description || "No description available."}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-slate-950">{money(book.price)}</p>
                        <p className="text-xs text-slate-500">{book.stock} in stock</p>
                      </div>
                      <button
                        className="btn-primary"
                        disabled={book.stock < 1}
                        onClick={() => addToCart(book)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="card p-5">
            <div className="mb-4 flex items-center gap-2">
              <ShoppingCartIcon size={18} className="text-indigo-600" />
              <h2 className="font-semibold text-slate-950">Cart</h2>
            </div>
            {cart.length === 0 ? (
              <p className="text-sm text-slate-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.bookId} className="rounded-md border border-slate-200 p-3">
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-500">{money(item.price)}</p>
                    <input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(event) =>
                        updateQuantity(item.bookId, Number(event.target.value))
                      }
                      className="mt-2"
                    />
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-slate-200 pt-3 font-semibold">
                  <span>Total</span>
                  <span>{money(cartTotal)}</span>
                </div>
                <button
                  className="btn-primary w-full"
                  disabled={placingOrder}
                  onClick={checkout}
                >
                  {placingOrder ? "Placing..." : "Checkout"}
                </button>
              </div>
            )}
          </section>

          <section className="card p-5">
            <h2 className="mb-4 font-semibold text-slate-950">My Orders</h2>
            {orders.length === 0 ? (
              <p className="text-sm text-slate-500">No orders yet.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order._id} className="rounded-md border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-slate-900">{money(order.totalPrice)}</p>
                      <span className="badge badge-warning">{order.status}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">
                      {order.items.map((item) => `${item.title} x${item.quantity}`).join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </aside>
      </main>
    </div>
  );
}
