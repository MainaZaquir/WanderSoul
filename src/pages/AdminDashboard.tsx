import { useState, useEffect, useCallback } from 'react';
import { Users, MapPin, ShoppingBag, MessageSquare, Award, Star, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { supabase, Trip, Product, User, Booking, Order, Review, CommunityPost, Sponsorship } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { formatPrice } from '../lib/currency';
import toast from 'react-hot-toast';

export function AdminDashboard() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrips: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingReviews: 0,
    activePosts: 0,
  });

  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [, setTrips] = useState<Trip[]>([]);
  const [, setProducts] = useState<Product[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [, setSponsorships] = useState<Sponsorship[]>([]);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [
        usersData,
        tripsData,
        productsData,
        bookingsData,
        ordersData,
        reviewsData,
        postsData,
        sponsorshipsData,
      ] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('trips').select('*'),
        supabase.from('products').select('*'),
        supabase.from('bookings').select('*, trip:trips(*), user:users(*)'),
        supabase.from('orders').select('*, user:users(*)'),
        supabase.from('reviews').select('*, user:users(*), trip:trips(*)'),
        supabase.from('community_posts').select('*, user:users(*)'),
        supabase.from('sponsorships').select('*'),
      ]);

      // Set data
      setUsers(usersData.data || []);
      setTrips(tripsData.data || []);
      setProducts(productsData.data || []);
      setBookings(bookingsData.data || []);
      setOrders(ordersData.data || []);
      setReviews(reviewsData.data || []);
      setPosts(postsData.data || []);
      setSponsorships(sponsorshipsData.data || []);

      // Calculate stats
      const totalRevenue = [
        ...(bookingsData.data || []).filter(b => b.payment_status === 'completed'),
        ...(ordersData.data || []).filter(o => o.payment_status === 'completed'),
      ].reduce((sum, item) => sum + Number(item.total_amount), 0);

      setStats({
        totalUsers: usersData.data?.length || 0,
        totalTrips: tripsData.data?.length || 0,
        totalBookings: bookingsData.data?.length || 0,
        totalRevenue,
        pendingReviews: reviewsData.data?.filter(r => !r.is_approved).length || 0,
        activePosts: postsData.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (profile?.is_admin) {
      fetchDashboardData();
    }
  }, [profile, fetchDashboardData]);

  const handleApproveReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_approved: true })
        .eq('id', reviewId);

      if (error) throw error;

      setReviews(prev => prev.map(review => 
        review.id === reviewId ? { ...review, is_approved: true } : review
      ));
      toast.success('Review approved');
    } catch (error) {
      console.error('Error approving review:', error);
      toast.error('Failed to approve review');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      setReviews(prev => prev.filter(review => review.id !== reviewId));
      toast.success('Review deleted');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const handleFeaturePost = async (postId: string, featured: boolean) => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .update({ is_featured: featured })
        .eq('id', postId);

      if (error) throw error;

      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, is_featured: featured } : post
      ));
      toast.success(`Post ${featured ? 'featured' : 'unfeatured'}`);
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    }
  };

  const handleToggleAdmin = async (userId: string, email: string, currentAdminStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentAdminStatus ? 'remove admin access from' : 'promote'} ${email}?`)) {
      return;
    }

    try {
      // Try using the database function first (if available)
      const { error: functionError } = await supabase.rpc('promote_user_to_admin', {
        target_email: email
      });

      // If function doesn't exist or fails, fall back to direct update
      if (functionError) {
        const { error } = await supabase
          .from('users')
          .update({ is_admin: !currentAdminStatus })
          .eq('id', userId);

        if (error) throw error;
      }

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_admin: !currentAdminStatus } : user
      ));
      toast.success(`User ${!currentAdminStatus ? 'promoted to admin' : 'removed from admin'}`);
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast.error('Failed to update admin status');
    }
  };

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your travel platform</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <MapPin className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Trips</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTrips}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-full">
                <Calendar className="text-orange-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <DollarSign className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'trips', label: 'Trips', icon: MapPin },
                { id: 'products', label: 'Products', icon: ShoppingBag },
                { id: 'bookings', label: 'Bookings', icon: Calendar },
                { id: 'reviews', label: 'Reviews', icon: Star },
                { id: 'community', label: 'Community', icon: MessageSquare },
                { id: 'sponsorships', label: 'Sponsorships', icon: Award },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Platform Overview</h2>
                
                {/* Recent Activity */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Recent Bookings</h3>
                    <div className="space-y-3">
                      {bookings.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{booking.user?.full_name}</p>
                            <p className="text-sm text-gray-600">{booking.trip?.title}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Pending Reviews</h3>
                    <div className="space-y-3">
                      {reviews.filter(r => !r.is_approved).slice(0, 5).map((review) => (
                        <div key={review.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{review.user?.full_name}</p>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => handleApproveReview(review.id)}
                            className="btn-primary text-xs px-3 py-1"
                          >
                            Approve
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Review Management</h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {reviews.filter(r => !r.is_approved).length} pending approval
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {review.user?.full_name?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{review.user?.full_name}</p>
                              <p className="text-sm text-gray-600">{review.trip?.title}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                          </div>
                          
                          {review.title && (
                            <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                          )}
                          
                          {review.comment && (
                            <p className="text-gray-700 mb-3">{review.comment}</p>
                          )}
                          
                          <p className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {review.is_approved ? (
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                              Approved
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() => handleApproveReview(review.id)}
                                className="btn-primary text-sm px-4 py-2"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleDeleteReview(review.id)}
                                className="btn-outline text-red-600 border-red-300 hover:bg-red-50 text-sm px-4 py-2"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'community' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Community Posts</h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {posts.filter(p => p.is_featured).length} featured posts
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {post.user?.full_name?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{post.user?.full_name}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(post.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            {post.is_featured && (
                              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                Featured
                              </span>
                            )}
                          </div>
                          
                          <h4 className="font-semibold text-gray-900 mb-2">{post.title}</h4>
                          <p className="text-gray-700 mb-3 line-clamp-2">{post.content}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{post.likes_count} likes</span>
                            <span>{post.comments_count} comments</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleFeaturePost(post.id, !post.is_featured)}
                            className={`text-sm px-4 py-2 rounded-lg font-medium ${
                              post.is_featured
                                ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {post.is_featured ? 'Unfeature' : 'Feature'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add other tab contents as needed */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.full_name || 'No name'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.is_admin 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.is_admin ? 'Admin' : 'User'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleToggleAdmin(user.id, user.email, user.is_admin)}
                              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                user.is_admin
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}