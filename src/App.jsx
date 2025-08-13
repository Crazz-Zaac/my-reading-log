import React, { useState, useMemo } from 'react';
import { allSampleData, getReadingStats, getTagFrequency } from './data/readingData';
import { SimpleAnalytics } from './components/SimpleAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Calendar, Star, Tag, TrendingUp, Filter, Search, BarChart3 } from 'lucide-react';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeTab, setActiveTab] = useState('timeline');

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = allSampleData.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      const matchesType = selectedType === 'all' || item.type === selectedType;
      const matchesTag = selectedTag === 'all' || item.tags.includes(selectedTag);
      
      return matchesSearch && matchesStatus && matchesType && matchesTag;
    });

    // Sort data
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'dateAdded' || sortBy === 'dateRead') {
        aValue = new Date(aValue || '1900-01-01');
        bValue = new Date(bValue || '1900-01-01');
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, selectedStatus, selectedType, selectedTag, sortBy, sortOrder]);

  const stats = getReadingStats(allSampleData);
  const tagFrequency = getTagFrequency(allSampleData);
  const allTags = Object.keys(tagFrequency).sort();
  const allTypes = [...new Set(allSampleData.map(item => item.type))];

  const formatDate = (dateString) => {
    if (!dateString) return 'Not read yet';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'read': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'to-read': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'book': return '📚';
      case 'article': return '📄';
      case 'video': return '🎥';
      case 'podcast': return '🎧';
      case 'linkedin_post': return '💼';
      default: return '📖';
    }
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating}/5)</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-navy-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white shadow-2xl relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        </div>
        
        <div className="container mx-auto px-6 py-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent leading-tight py-1">
                  Personal Reading Log
                </h1>
              </div>
              <p className="text-navy-200 text-xl max-w-2xl leading-relaxed">
                A curated collection of books, articles, and insights that have shaped my thinking
              </p>
              <div className="mt-6 flex items-center gap-4 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-navy-300">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Updated regularly</span>
                </div>
                <div className="flex items-center gap-2 text-navy-300">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">Analytics-driven insights</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="text-3xl font-bold text-white mb-1">{stats.totalItems}</div>
                  <div className="text-navy-200 text-sm font-medium">Total Items</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="text-3xl font-bold text-green-400 mb-1">{stats.readItems}</div>
                  <div className="text-navy-200 text-sm font-medium">Completed</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="text-3xl font-bold text-yellow-400 mb-1">{stats.averageRating}</div>
                  <div className="text-navy-200 text-sm font-medium">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg className="relative block w-full h-8" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
          </svg>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Timeline View
            </TabsTrigger>
            <TabsTrigger value="cards" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Card View
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Filters - Hidden for Analytics tab */}
          {activeTab !== 'analytics' && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search titles, authors, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="to-read">To Read</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {allTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {getTypeIcon(type)} {type.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {allTags.map(tag => (
                    <SelectItem key={tag} value={tag}>
                      {tag} ({tagFrequency[tag]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dateAdded">Date Added</SelectItem>
                  <SelectItem value="dateRead">Date Read</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
          )}

          <TabsContent value="timeline" className="space-y-6">
            <div className="relative max-w-4xl mx-auto">
              {/* Timeline line */}
              <div className="absolute left-6 top-8 bottom-8 w-1 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 rounded-full shadow-sm"></div>
              
              {filteredData.map((item, index) => (
                <div key={item.id} className="relative flex items-start gap-8 pb-12 last:pb-0">
                  {/* Timeline dot with date */}
                  <div className="relative z-10 flex-shrink-0 flex flex-col items-center">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 font-medium bg-white px-2 py-1 rounded shadow-sm border">
                      {formatDate(item.dateAdded)}
                    </div>
                  </div>
                  
                  {/* Content card */}
                  <Card className="flex-1 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2 text-gray-900 flex items-center gap-2">
                            <span className="text-2xl">{getTypeIcon(item.type)}</span>
                            <span className="leading-tight">{item.title}</span>
                          </CardTitle>
                          <CardDescription className="text-base text-gray-600 font-medium">
                            by {item.author}
                            {item.dateRead && (
                              <span className="ml-2 text-green-600">
                                • Read on {formatDate(item.dateRead)}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                        <Badge className={`${getStatusColor(item.status)} text-xs font-semibold px-3 py-1`}>
                          {item.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {item.rating && (
                          <div className="flex items-center gap-2">
                            {renderStars(item.rating)}
                            <span className="text-sm text-gray-600 font-medium">({item.rating}/5)</span>
                          </div>
                        )}
                        
                        {item.keyInsights && (
                          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                              💡 Key Insights
                            </h4>
                            <p className="text-blue-800 text-sm leading-relaxed">{item.keyInsights}</p>
                          </div>
                        )}
                        
                        {item.personalReflection && (
                          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                            <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                              🤔 Personal Reflection
                            </h4>
                            <p className="text-green-800 text-sm leading-relaxed">{item.personalReflection}</p>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2 pt-2">
                          {item.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="pt-2 border-t border-gray-100">
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                          >
                            View Source →
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{getTypeIcon(item.type)}</span>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-navy-900">{item.title}</CardTitle>
                  <CardDescription>by {item.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      Added: {formatDate(item.dateAdded)}
                      {item.dateRead && (
                        <span className="block">Read: {formatDate(item.dateRead)}</span>
                      )}
                    </div>
                    
                    {item.rating && renderStars(item.rating)}
                    
                    {item.keyInsights && (
                      <p className="text-sm text-gray-700 line-clamp-3">{item.keyInsights}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="analytics">
            <SimpleAnalytics data={allSampleData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;

