import { useEffect, useMemo, useState } from "react";
import { LogOutIcon, PlusIcon, RefreshCcwIcon } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch, getSessionUser } from "../../api";

const initialBook = {
  title: "",
  author: "",
  price: "",
  genre: "",
  stock: "",
  isbn: "",
  description: "",
  imageUrl: "",
};

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value) || 0);
}

export default function AdminPortal() {
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bookForm, setBookForm] = useState(initialBook);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const user = getSessionUser();

  const metrics = useMemo(
    () => ({
      books: books.length,
      stock: books.reduce((total, book) => total + Number(book.stock || 0), 0),
      orders: orders.length,
      revenue: orders.reduce((total, order) => total + Number(order.totalPrice || 0), 0),
    }),
    [books, orders],
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookData, orderData] = await Promise.all([apiFetch("books"), apiFetch("orders")]);
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

  const saveBook = async (event) => {
    event.preventDefault();
    const payload = {
      ...bookForm,
      price: Number(bookForm.price),
      stock: Number(bookForm.stock),
    };

    try {
      if (editingId) {
        await apiFetch(`books/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Book updated");
      } else {
        await apiFetch("books", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Book added");
      }
      setBookForm(initialBook);
      setEditingId("");
      await loadData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const editBook = (book) => {
    setEditingId(book._id);
    setBookForm({
      title: book.title || "",
      author: book.author || "",
      price: book.price || "",
      genre: book.genre || "",
      stock: book.stock || "",
      isbn: book.isbn || "",
      description: book.description || "",
      imageUrl: book.imageUrl || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteBook = async (bookId) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await apiFetch(`books/${bookId}`, { method: "DELETE" });
      toast.success("Book deleted");
      await loadData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await apiFetch(`orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      toast.success("Order updated");
      await loadData();
    } catch (error) {
      toast.error(error.message);
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
            <p className="text-sm font-medium text-indigo-600">Admin Portal</p>
            <h1 className="font-heading text-2xl font-semibold text-slate-950">
              Bookstore Management System
            </h1>
            <p className="text-sm text-slate-500">Signed in as {user?.name}</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary inline-flex items-center gap-2" onClick={loadData}>
              <RefreshCcwIcon size={16} /> Refresh
            </button>
            <button className="btn-secondary inline-flex items-center gap-2" onClick={logout}>
              <LogOutIcon size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-4">
          <div className="card p-5">
            <p className="text-sm text-slate-500">Books</p>
            <p className="mt-1 text-2xl font-semibold">{metrics.books}</p>
          </div>
          <div className="card p-5">
            <p className="text-sm text-slate-500">Stock</p>
            <p className="mt-1 text-2xl font-semibold">{metrics.stock}</p>
          </div>
          <div className="card p-5">
            <p className="text-sm text-slate-500">Orders</p>
            <p className="mt-1 text-2xl font-semibold">{metrics.orders}</p>
          </div>
          <div className="card p-5">
            <p className="text-sm text-slate-500">Revenue</p>
            <p className="mt-1 text-2xl font-semibold">{money(metrics.revenue)}</p>
          </div>
        </section>

        <section className="card p-5">
          <div className="mb-5 flex items-center gap-2">
            <PlusIcon size={18} className="text-indigo-600" />
            <h2 className="font-semibold text-slate-950">
              {editingId ? "Update Book" : "Add Book"}
            </h2>
          </div>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={saveBook}>
            {[
              ["title", "Title"],
              ["author", "Author"],
              ["price", "Price"],
              ["genre", "Genre"],
              ["stock", "Stock"],
              ["isbn", "ISBN"],
              ["imageUrl", "Image URL"],
            ].map(([key, label]) => (
              <label key={key} className="text-sm font-medium text-slate-700">
                {label}
                <input
                  type={key === "price" || key === "stock" ? "number" : "text"}
                  min={key === "price" || key === "stock" ? "0" : undefined}
                  step={key === "price" ? "0.01" : undefined}
                  value={bookForm[key]}
                  onChange={(event) => setBookForm({ ...bookForm, [key]: event.target.value })}
                  required={key !== "imageUrl"}
                  className="mt-2"
                />
              </label>
            ))}
            <label className="text-sm font-medium text-slate-700 md:col-span-2">
              Description
              <textarea
                value={bookForm.description}
                onChange={(event) =>
                  setBookForm({ ...bookForm, description: event.target.value })
                }
                rows="3"
                className="mt-2"
              />
            </label>
            <div className="flex gap-3 md:col-span-2">
              <button className="btn-primary" type="submit">
                {editingId ? "Save Changes" : "Add Book"}
              </button>
              {editingId ? (
                <button
                  className="btn-secondary"
                  type="button"
                  onClick={() => {
                    setEditingId("");
                    setBookForm(initialBook);
                  }}
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="card overflow-hidden">
            <div className="border-b border-slate-200 p-5">
              <h2 className="font-semibold text-slate-950">Inventory</h2>
            </div>
            {loading ? (
              <p className="p-5 text-sm text-slate-500">Loading books...</p>
            ) : books.length === 0 ? (
              <p className="p-5 text-sm text-slate-500">No books added yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>Book</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book._id}>
                        <td>
                          <p className="font-medium text-slate-900">{book.title}</p>
                          <p className="text-xs text-slate-500">{book.author}</p>
                        </td>
                        <td>{money(book.price)}</td>
                        <td>{book.stock}</td>
                        <td>
                          <div className="flex gap-2">
                            <button className="btn-secondary" onClick={() => editBook(book)}>
                              Edit
                            </button>
                            <button className="btn-secondary" onClick={() => deleteBook(book._id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-slate-200 p-5">
              <h2 className="font-semibold text-slate-950">Orders</h2>
            </div>
            {orders.length === 0 ? (
              <p className="p-5 text-sm text-slate-500">No customer orders yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <div key={order._id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-slate-950">{order.userInfo?.name}</p>
                        <p className="text-sm text-slate-500">{order.userInfo?.email}</p>
                      </div>
                      <span className="badge badge-warning">{order.status}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">
                      {order.items.map((item) => `${item.title} x${item.quantity}`).join(", ")}
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="font-semibold">{money(order.totalPrice)}</p>
                      <select
                        value={order.status}
                        onChange={(event) => updateStatus(order._id, event.target.value)}
                        className="max-w-40"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
