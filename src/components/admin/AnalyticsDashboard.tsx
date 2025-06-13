
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, TrendingUp, Users, MapPin, Star, Clock } from 'lucide-react';

interface AnalyticsData {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  totalVenues: number;
  activeVenues: number;
  totalReviews: number;
  averageRating: number;
  applicationsByMonth: Array<{ month: string; count: number }>;
  venuesByType: Array<{ type: string; count: number; color: string }>;
  recentActivity: Array<{ type: string; description: string; date: string }>;
}

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      // Fetch applications data
      const { data: applications } = await supabase
        .from('venue_applications')
        .select('status, created_at');

      // Fetch venues data
      const { data: venues } = await supabase
        .from('venues')
        .select('business_type, is_active, rating, created_at');

      // Fetch reviews data
      const { data: reviews } = await supabase
        .from('venue_reviews')
        .select('rating, created_at, is_approved');

      if (!applications || !venues || !reviews) {
        throw new Error('Failed to fetch data');
      }

      // Process applications by status
      const totalApplications = applications.length;
      const pendingApplications = applications.filter(app => app.status === 'pending').length;
      const approvedApplications = applications.filter(app => app.status === 'approved').length;

      // Process venues data
      const totalVenues = venues.length;
      const activeVenues = venues.filter(venue => venue.is_active).length;

      // Process reviews data
      const approvedReviews = reviews.filter(review => review.is_approved);
      const totalReviews = approvedReviews.length;
      const averageRating = approvedReviews.length > 0 
        ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) / approvedReviews.length
        : 0;

      // Applications by month (last 6 months)
      const applicationsByMonth = getMonthlyData(applications, 6);

      // Venues by type
      const venueTypeColors = {
        'pub': '#60a5fa',
        'restaurant': '#f472b6',
        'shop': '#34d399',
        'gym': '#fbbf24',
        'cinema': '#a78bfa',
        'office': '#f87171'
      };

      const venuesByType = Object.entries(
        venues.reduce((acc: Record<string, number>, venue) => {
          const type = venue.business_type.toLowerCase();
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {})
      ).map(([type, count]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        count: count as number,
        color: venueTypeColors[type as keyof typeof venueTypeColors] || '#6b7280'
      }));

      // Recent activity
      const recentActivity = [
        ...applications.slice(-5).map(app => ({
          type: 'application',
          description: `New application submitted (${app.status})`,
          date: new Date(app.created_at).toLocaleDateString()
        })),
        ...venues.slice(-3).map(venue => ({
          type: 'venue',
          description: `New venue published: ${venue.business_type}`,
          date: new Date(venue.created_at).toLocaleDateString()
        })),
        ...reviews.slice(-3).map(review => ({
          type: 'review',
          description: `New review submitted (${review.rating} stars)`,
          date: new Date(review.created_at).toLocaleDateString()
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

      setAnalytics({
        totalApplications,
        pendingApplications,
        approvedApplications,
        totalVenues,
        activeVenues,
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        applicationsByMonth,
        venuesByType,
        recentActivity
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMonthlyData = (data: any[], months: number) => {
    const now = new Date();
    const monthlyData = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const count = data.filter(item => {
        const itemDate = new Date(item.created_at);
        return itemDate.getMonth() === date.getMonth() && 
               itemDate.getFullYear() === date.getFullYear();
      }).length;
      
      monthlyData.push({ month: monthName, count });
    }
    
    return monthlyData;
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-brand-navy/60">Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-navy">Analytics Dashboard</h2>
        <Badge variant="outline" className="text-brand-navy">
          <Calendar className="w-4 h-4 mr-1" />
          Last updated: {new Date().toLocaleDateString()}
        </Badge>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-trans-blue/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-brand-navy/70">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-trans-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-navy">{analytics.totalApplications}</div>
            <p className="text-xs text-brand-navy/60">
              {analytics.pendingApplications} pending • {analytics.approvedApplications} approved
            </p>
          </CardContent>
        </Card>

        <Card className="border-trans-blue/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-brand-navy/70">Live Venues</CardTitle>
            <MapPin className="h-4 w-4 text-trans-pink" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-navy">{analytics.totalVenues}</div>
            <p className="text-xs text-brand-navy/60">
              {analytics.activeVenues} active venues
            </p>
          </CardContent>
        </Card>

        <Card className="border-trans-blue/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-brand-navy/70">Total Reviews</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-navy">{analytics.totalReviews}</div>
            <p className="text-xs text-brand-navy/60">
              Avg rating: {analytics.averageRating}/5
            </p>
          </CardContent>
        </Card>

        <Card className="border-trans-blue/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-brand-navy/70">Platform Health</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Good</div>
            <p className="text-xs text-brand-navy/60">
              {Math.round((analytics.activeVenues / analytics.totalVenues) * 100)}% venues active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications by Month */}
        <Card className="border-trans-blue/20">
          <CardHeader>
            <CardTitle className="text-brand-navy">Applications Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.applicationsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Venues by Type */}
        <Card className="border-trans-blue/20">
          <CardHeader>
            <CardTitle className="text-brand-navy">Venues by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.venuesByType}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ type, count }) => `${type}: ${count}`}
                >
                  {analytics.venuesByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-trans-blue/20">
        <CardHeader>
          <CardTitle className="text-brand-navy flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant="outline" 
                    className={
                      activity.type === 'application' ? 'border-trans-blue text-trans-blue' :
                      activity.type === 'venue' ? 'border-trans-pink text-trans-pink' :
                      'border-yellow-500 text-yellow-700'
                    }
                  >
                    {activity.type}
                  </Badge>
                  <span className="text-sm text-brand-navy">{activity.description}</span>
                </div>
                <span className="text-xs text-brand-navy/60">{activity.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
