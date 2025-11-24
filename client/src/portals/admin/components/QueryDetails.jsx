import React, { useState } from 'react';
import { ChevronLeft, Send, User, Mail, Phone, GraduationCap, Calendar, Hash } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Badge } from '@/common/components/ui/badge';

const QueryDetails = ({ query, onBack }) => {
  const [response, setResponse] = useState('');

  const handleSendReply = () => {
    console.log('Sending reply:', response);
    // Add your reply submission logic here
    setResponse('');
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Open':
        return 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20';
      case 'In Progress':
        return 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/20';
      case 'Resolved':
        return 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20 border border-zinc-500/20';
    }
  };

  const getPriorityColor = priority => {
    switch (priority) {
      case 'High':
        return 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20';
      case 'Medium':
        return 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/20';
      case 'Low':
        return 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20 border border-zinc-500/20';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-zinc-950">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Back to Queries</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">Query Details</h1>
          <p className="text-zinc-400">Review and respond to student query</p>
        </div>

        {/* Student Info Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {query.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-100">{query.name}</h2>
                <p className="text-sm text-zinc-400 mt-1">Joined: {query.submittedDate}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={getPriorityColor(query.priority)}>{query.priority} Priority</Badge>
              <Badge className={getStatusColor(query.status)}>{query.status}</Badge>
            </div>
          </div>

          {/* Student Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-zinc-800 p-4 rounded-lg border border-zinc-700">
              <Mail className="w-5 h-5 text-blue-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-zinc-500 mb-1">Email</p>
                <p className="text-sm text-zinc-200 truncate">{query.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-zinc-800 p-4 rounded-lg border border-zinc-700">
              <Phone className="w-5 h-5 text-green-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-zinc-500 mb-1">Phone</p>
                <p className="text-sm text-zinc-200">{query.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-zinc-800 p-4 rounded-lg border border-zinc-700">
              <Hash className="w-5 h-5 text-purple-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-zinc-500 mb-1">Student ID</p>
                <p className="text-sm text-zinc-200">{query.studentId}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-zinc-800 p-4 rounded-lg border border-zinc-700">
              <GraduationCap className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-zinc-500 mb-1">College</p>
                <p className="text-sm text-zinc-200 truncate">{query.college}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-zinc-800 p-4 rounded-lg border border-zinc-700">
              <Calendar className="w-5 h-5 text-cyan-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-zinc-500 mb-1">Year</p>
                <p className="text-sm text-zinc-200">{query.year}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-zinc-800 p-4 rounded-lg border border-zinc-700">
              <User className="w-5 h-5 text-pink-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-zinc-500 mb-1">Category</p>
                <p className="text-sm text-zinc-200">{query.category}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Query Details Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6 shadow-lg">
          {/* Query Topic */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-blue-400 mb-2">Query Topic</h3>
            <p className="text-lg font-semibold text-zinc-100">{query.queryTopic}</p>
          </div>

          {/* Student's Query */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-blue-400 mb-3">Student's Query</h3>
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
              <p className="text-zinc-200 leading-relaxed">{query.queryText}</p>
            </div>
          </div>

          {/* Courses Involved */}
          <div>
            <h3 className="text-sm font-semibold text-blue-400 mb-3">Courses Involved</h3>
            <div className="flex flex-wrap gap-2">
              {query.coursesInvolved.map((course, index) => (
                <Badge
                  key={index}
                  className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 px-3 py-1"
                >
                  {course}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Reply Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-zinc-100 mb-4">Reply to Query</h3>
          <textarea
            value={response}
            onChange={e => setResponse(e.target.value)}
            placeholder="Type your response here..."
            rows={6}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleSendReply}
              disabled={!response.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Send Reply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryDetails;
