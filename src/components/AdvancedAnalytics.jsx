import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Treemap, ScatterChart, Scatter
} from 'recharts';
import { Calendar, TrendingUp, BookOpen, Star, Target, Network } from 'lucide-react';

// Enhanced color palettes for better readability and intuitive understanding
const CHART_COLORS = {
  primary: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'],
  secondary: ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
  accent: ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca'],
  neutral: ['#374151', '#6b7280', '#9ca3af', '#d1d5db', '#f3f4f6'],
  gradient: ['#1e40af', '#3730a3', '#7c3aed', '#c026d3', '#e879f9'],
  warm: ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa'],
  cool: ['#0891b2', '#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc']
};

// Specific color mappings for different content types
const TYPE_COLORS = {
  'book': '#1e40af',
  'article': '#059669', 
  'video': '#dc2626',
  'podcast': '#7c3aed',
  'linkedin post': '#ea580c',
  'linkedin_post': '#ea580c'
};

// Tag category colors for treemap
const TAG_CATEGORY_COLORS = {
  'Technology': '#1e40af',
  'AI': '#3730a3',
  'Programming': '#1d4ed8',
  'Machine Learning': '#2563eb',
  'Psychology': '#059669',
  'Productivity': '#10b981',
  'Self-Improvement': '#047857',
  'Health': '#065f46',
  'Entrepreneurship': '#dc2626',
  'Business': '#b91c1c',
  'Philosophy': '#7c3aed',
  'Science': '#0891b2',
  'default': '#6b7280'
};

const COLORS = Object.values(CHART_COLORS.gradient);

export const AdvancedAnalytics = ({ data }) => {
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

  // Cumulative reading progress
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

  // Tag treemap data with colors
  const tagTreemapData = useMemo(() => {
    const tagCounts = {};
    data.forEach(item => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    return Object.entries(tagCounts).map(([name, size]) => ({ 
      name, 
      size,
      fill: TAG_CATEGORY_COLORS[name] || TAG_CATEGORY_COLORS.default
    }));
  }, [data]);

  // Rating distribution with colors
  const ratingData = useMemo(() => {
    const ratings = [1, 2, 3, 4, 5];
    return ratings.map((rating, index) => ({
      rating: `${rating} Star${rating > 1 ? 's' : ''}`,
      count: data.filter(item => item.rating === rating).length,
      fill: CHART_COLORS.warm[index]
    }));
  }, [data]);

  // Content type distribution with specific colors
  const typeData = useMemo(() => {
    const typeCounts = {};
    data.forEach(item => {
      if (item.type) {
        const type = item.type.replace('_', ' ');
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      }
    });
    return Object.entries(typeCounts).map(([name, value]) => ({ 
      name, 
      value,
      fill: TYPE_COLORS[name] || TYPE_COLORS[name.replace(' ', '_')] || CHART_COLORS.neutral[0]
    }));
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
        dimension: 'Philosophy', 
        value: readItems.filter(item => 
          item.tags && item.tags.includes('Philosophy')
        ).length 
      }
    ];
    return dimensions;
  }, [data]);

  // Impact vs Rating scatter plot
  const scatterData = useMemo(() => {
    return data
      .filter(item => item.rating && item.impact)
      .map(item => ({
        rating: item.rating,
        impact: item.impact,
        title: item.title,
        type: item.type
      }));
  }, [data]);

  // Word cloud data from key insights
    // Word cloud data from tags
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


  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Reading Frequency Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill={CHART_COLORS.primary[1]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Cumulative Progress
            </CardTitle>
            <CardDescription>Reading progress over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cumulativeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke={CHART_COLORS.secondary[1]} 
                  strokeWidth={3}
                  dot={{ fill: CHART_COLORS.secondary[1], strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: CHART_COLORS.secondary[0] }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tag Treemap and Rating Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tag Distribution Treemap</CardTitle>
            <CardDescription>Visual representation of tag frequency</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <Treemap
                data={tagTreemapData}
                dataKey="size"
                aspectRatio={4/3}
                stroke="#fff"
                strokeWidth={2}
                content={({ root, depth, x, y, width, height, index, payload, colors, name }) => {
                  if (depth === 1) {
                    return (
                      <g>
                        <rect
                          x={x}
                          y={y}
                          width={width}
                          height={height}
                          style={{
                            fill: payload.fill,
                            stroke: '#fff',
                            strokeWidth: 2,
                            strokeOpacity: 1,
                          }}
                        />
                        {width > 60 && height > 30 && (
                          <text
                            x={x + width / 2}
                            y={y + height / 2}
                            textAnchor="middle"
                            fill="#fff"
                            fontSize={Math.min(width / 8, height / 4, 14)}
                            fontWeight="bold"
                          >
                            {name}
                          </text>
                        )}
                        {width > 80 && height > 50 && (
                          <text
                            x={x + width / 2}
                            y={y + height / 2 + 16}
                            textAnchor="middle"
                            fill="#fff"
                            fontSize={Math.min(width / 12, height / 6, 10)}
                            opacity={0.8}
                          >
                            {payload.size}
                          </text>
                        )}
                      </g>
                    );
                  }
                }}
              />
            </ResponsiveContainer>
          </CardContent>
        </Card>

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
              <BarChart data={ratingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="rating" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {ratingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Content Types and Reading Dimensions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Content Type Distribution
            </CardTitle>
            <CardDescription>Breakdown by content type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Reading Dimensions
            </CardTitle>
            <CardDescription>Knowledge areas coverage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12, fill: '#64748b' }} />
                <PolarRadiusAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Radar
                  name="Items Read"
                  dataKey="value"
                  stroke={CHART_COLORS.gradient[2]}
                  fill={CHART_COLORS.gradient[2]}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Impact vs Rating and Word Cloud */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Impact vs Rating Analysis</CardTitle>
            <CardDescription>Correlation between personal impact and rating</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={scatterData}>
                <CartesianGrid stroke="#e2e8f0" />
                <XAxis dataKey="rating" name="Rating" unit="/5" stroke="#64748b" fontSize={12} />
                <YAxis dataKey="impact" name="Impact" unit="/5" stroke="#64748b" fontSize={12} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Items" dataKey="impact" fill={CHART_COLORS.accent[1]} />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Insights Word Frequency</CardTitle>
            <CardDescription>Most common words in insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {insightWords.map(({ word, count }, index) => (
                <div key={word} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-medium capitalize text-gray-700">{word}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(count / insightWords[0].count) * 100}%`,
                          backgroundColor: CHART_COLORS.cool[index % CHART_COLORS.cool.length]
                        }}
                      ></div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="text-xs min-w-[24px] justify-center"
                      style={{ 
                        backgroundColor: `${CHART_COLORS.cool[index % CHART_COLORS.cool.length]}15`,
                        color: CHART_COLORS.cool[index % CHART_COLORS.cool.length],
                        borderColor: `${CHART_COLORS.cool[index % CHART_COLORS.cool.length]}30`
                      }}
                    >
                      {count}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Graph Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            Related Reads Network
          </CardTitle>
          <CardDescription>Connections between related content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <Network className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Network visualization of related reads</p>
              <p className="text-sm text-gray-500 mt-1">
                Shows connections between items with shared authors, topics, or citations
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {data.filter(item => item.relatedTo && item.relatedTo.length > 0).map(item => (
                  <Badge key={item.id} variant="outline" className="text-xs">
                    {item.title.substring(0, 20)}...
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

