import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Calendar, TrendingUp, BookOpen, Star, Target, Brain, Activity } from 'lucide-react';
import WordCloud from './WordCloud';

// Enhanced color palettes
const CHART_COLORS = {
  primary: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'],
  secondary: ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
  accent: ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca'],
  warm: ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa'],
  cool: ['#0891b2', '#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc']
};

export const SimpleAnalytics = ({ data }) => {
  // Ensure data is valid
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No data available for analytics</p>
      </div>
    );
  }

  // Reading frequency by month
  const monthlyData = useMemo(() => {
    const monthCounts = {};
    data.filter(item => item.dateRead).forEach(item => {
      const month = new Date(item.dateRead).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });
    return Object.entries(monthCounts).map(([month, count]) => ({ month, count })).slice(-12);
  }, [data]);

  // Cumulative reading progress over time
  const cumulativeData = useMemo(() => {
    const sortedData = data
      .filter(item => item.dateRead)
      .sort((a, b) => new Date(a.dateRead) - new Date(b.dateRead));
    
    let cumulative = 0;
    return sortedData.map(item => {
      cumulative++;
      return {
        date: new Date(item.dateRead).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        cumulative,
        title: item.title
      };
    });
  }, [data]);

  // Reading dimensions radar chart
  const radarData = useMemo(() => {
    const readItems = data.filter(item => item.status === 'read');
    const dimensions = [
      { 
        dimension: 'Productivity', 
        value: readItems.filter(item => 
          item.tags && item.tags.includes('Productivity')
        ).length 
      },
      { 
        dimension: 'Technology', 
        value: readItems.filter(item => 
          item.tags && item.tags.some(tag => ['AI', 'Programming', 'Technology'].includes(tag))
        ).length 
      },
      { 
        dimension: 'Psychology', 
        value: readItems.filter(item => 
          item.tags && item.tags.includes('Psychology')
        ).length 
      },
      { 
        dimension: 'Business', 
        value: readItems.filter(item => 
          item.tags && item.tags.some(tag => ['Entrepreneurship', 'Product Management'].includes(tag))
        ).length 
      },
      { 
        dimension: 'Health', 
        value: readItems.filter(item => 
          item.tags && item.tags.includes('Health')
        ).length 
      },
      { 
        dimension: 'Science', 
        value: readItems.filter(item => 
          item.tags && item.tags.includes('Science')
        ).length 
      }
    ];
    return dimensions;
  }, [data]);

  // Rating distribution
  const ratingData = useMemo(() => {
    const ratings = [1, 2, 3, 4, 5];
    return ratings.map((rating, index) => ({
      rating: `${rating} Star${rating > 1 ? 's' : ''}`,
      count: data.filter(item => item.rating === rating).length,
      fill: CHART_COLORS.warm[index]
    }));
  }, [data]);

  // Word cloud data from key insights
  const wordCloudData = useMemo(() => {
    const tagCounts = {};
    data.forEach(item => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(tag => {
          // Clean and normalize tag
          const cleanTag = tag.trim();
          if (cleanTag) {
            tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1;
          }
        });
      }
    });
    
    return Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20) // Show top 20 tags
      .map(([word, count]) => ({ word, count }));
  }, [data]);


  // Basic stats
  const stats = useMemo(() => {
    const readItems = data.filter(item => item.status === 'read');
    const totalRating = readItems.reduce((sum, item) => sum + (item.rating || 0), 0);
    const avgRating = readItems.length > 0 ? (totalRating / readItems.length).toFixed(1) : 0;
    
    return {
      total: data.length,
      read: readItems.length,
      inProgress: data.filter(item => item.status === 'in-progress').length,
      toRead: data.filter(item => item.status === 'to-read').length,
      avgRating
    };
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.read}</div>
            <div className="text-sm text-gray-600">Read</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.toRead}</div>
            <div className="text-sm text-gray-600">To Read</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.avgRating}</div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Reading */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Monthly Reading Frequency
            </CardTitle>
            <CardDescription>Books and articles read per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill={CHART_COLORS.primary[1]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cumulative Progress Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Cumulative Reading Progress
            </CardTitle>
            <CardDescription>Total books read over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cumulativeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke={CHART_COLORS.secondary[1]} 
                  strokeWidth={3}
                  dot={{ fill: CHART_COLORS.secondary[1], strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Reading Dimensions Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Reading Dimensions
            </CardTitle>
            <CardDescription>Distribution across different topics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12, fill: '#64748b' }} />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, Math.max(...radarData.map(d => d.value)) + 1]}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                />
                <Radar
                  name="Reading Count"
                  dataKey="value"
                  stroke={CHART_COLORS.accent[1]}
                  fill={CHART_COLORS.accent[1]}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Word Cloud from Key Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Key Insights Word Cloud
            </CardTitle>
            <CardDescription>Most frequent words from insights</CardDescription>
          </CardHeader>
          <CardContent>
            <WordCloud words={wordCloudData} width={400} height={300} />
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Rating Distribution
          </CardTitle>
          <CardDescription>Distribution of ratings given</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" fontSize={12} />
              <YAxis dataKey="rating" type="category" stroke="#64748b" fontSize={12} width={80} />
              <Tooltip />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {ratingData.map((entry, index) => (
                  <Bar key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

