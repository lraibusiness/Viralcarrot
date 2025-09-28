interface Stats {
  totalUsers: number;
  totalRecipes: number;
  pendingRecipes: number;
  approvedRecipes: number;
}

interface OverviewProps {
  stats: Stats;
}

export default function Overview({ stats }: OverviewProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Platform Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Users</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">��️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Total Recipes</p>
              <p className="text-2xl font-bold text-green-900">{stats.totalRecipes}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.pendingRecipes}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Approved Recipes</p>
              <p className="text-2xl font-bold text-purple-900">{stats.approvedRecipes}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h4 className="font-medium text-slate-800 mb-2">Review Pending Recipes</h4>
            <p className="text-sm text-slate-600 mb-3">Check and approve user-submitted recipes</p>
            <button className="text-amber-600 hover:text-amber-700 font-medium text-sm">
              Go to Pending →
            </button>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h4 className="font-medium text-slate-800 mb-2">Manage Users</h4>
            <p className="text-sm text-slate-600 mb-3">View and manage user accounts</p>
            <button className="text-amber-600 hover:text-amber-700 font-medium text-sm">
              Go to Users →
            </button>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h4 className="font-medium text-slate-800 mb-2">View Analytics</h4>
            <p className="text-sm text-slate-600 mb-3">Check platform performance and insights</p>
            <button className="text-amber-600 hover:text-amber-700 font-medium text-sm">
              Go to Analytics →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
