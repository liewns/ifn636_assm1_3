import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="px-8 py-16">
        {/* Hero section introducing the application */}
        <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
              Manage your travel spending with confidence
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Plan trips, record expenses, monitor budgets, and keep your travel
              costs organised in one convenient system.
            </p>

            {/* Main action buttons for new and returning users */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Example overview card showing sample trip summary information */}
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-slate-800">Trip Overview</h3>

            <div className="space-y-4">
              <div className="flex justify-between border-b pb-3">
                <span className="text-slate-600">Total Trips</span>
                <span className="font-bold">4</span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span className="text-slate-600">Total Budget</span>
                <span className="font-bold">$4,500</span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span className="text-slate-600">Total Spent</span>
                <span className="font-bold">$3,120</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Remaining</span>
                <span className="font-bold text-green-600">$1,380</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features section highlighting key system benefits */}
        <section className="max-w-6xl mx-auto mt-20">
          <h3 className="text-3xl font-bold text-center mb-10 text-slate-900">
            Why use Travel Expense Tracker?
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h4 className="text-xl font-semibold mb-3">Plan Trips</h4>
              <p className="text-slate-600">
                Create trips with destination, travel dates, and budget details.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h4 className="text-xl font-semibold mb-3">Track Expenses</h4>
              <p className="text-slate-600">
                Log transport, food, accommodation, and other travel costs.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h4 className="text-xl font-semibold mb-3">Stay on Budget</h4>
              <p className="text-slate-600">
                Compare your spending against your planned travel budget.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h4 className="text-xl font-semibold mb-3">View Reports</h4>
              <p className="text-slate-600">
                Review travel spending summaries by trip and category.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;