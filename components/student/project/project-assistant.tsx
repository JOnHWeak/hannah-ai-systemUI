"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Code,
  Bug,
  Lightbulb,
  Search,
  Filter,
  Plus,
  Trash2,
  Eye,
  MessageSquare,
} from "lucide-react"

interface ProjectIssue {
  id: string
  title: string
  description: string
  status: "open" | "in-progress" | "resolved"
  priority: "low" | "medium" | "high"
  category: "bug" | "feature" | "question" | "help"
  createdAt: Date
  updatedAt: Date
  files?: string[]
  solution?: string
}

const mockIssues: ProjectIssue[] = [
  {
    id: "1",
    title: "React component not rendering properly",
    description: "My component shows undefined instead of the expected data. I think it's related to props passing.",
    status: "resolved",
    priority: "high",
    category: "bug",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    files: ["App.js", "UserCard.js"],
    solution: "The issue was with async data loading. Added proper loading states and null checks.",
  },
  {
    id: "2",
    title: "Database connection timeout",
    description: "Getting timeout errors when trying to connect to MySQL database. Connection works locally but fails on server.",
    status: "in-progress",
    priority: "high",
    category: "bug",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
    files: ["config.js", "database.js"],
  },
  {
    id: "3",
    title: "How to implement user authentication?",
    description: "Need guidance on implementing secure user authentication with JWT tokens in my Node.js app.",
    status: "open",
    priority: "medium",
    category: "question",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
  },
]

export function ProjectAssistant() {
  const [issues, setIssues] = useState<ProjectIssue[]>(mockIssues)
  const [newIssue, setNewIssue] = useState({
    title: "",
    description: "",
    category: "question" as const,
    priority: "medium" as const,
  })
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredIssues = issues.filter(issue => {
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <AlertCircle className="h-4 w-4 text-red-500" />
      case "in-progress": return <Clock className="h-4 w-4 text-yellow-500" />
      case "resolved": return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "bug": return <Bug className="h-4 w-4 text-red-500" />
      case "feature": return <Lightbulb className="h-4 w-4 text-blue-500" />
      case "question": return <MessageSquare className="h-4 w-4 text-purple-500" />
      case "help": return <AlertCircle className="h-4 w-4 text-orange-500" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleCreateIssue = () => {
    if (!newIssue.title.trim() || !newIssue.description.trim()) return

    const issue: ProjectIssue = {
      id: Date.now().toString(),
      ...newIssue,
      status: "open",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setIssues(prev => [issue, ...prev])
    setNewIssue({
      title: "",
      description: "",
      category: "question",
      priority: "medium",
    })
  }

  return (
    <div className="h-full bg-gray-50">
      <Tabs defaultValue="issues" className="h-full flex flex-col">
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Project Assistant</h1>
                <p className="text-gray-600">Get help with your projects and track issues</p>
              </div>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                New Issue
              </Button>
            </div>

            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="issues">My Issues</TabsTrigger>
              <TabsTrigger value="create">Create Issue</TabsTrigger>
              <TabsTrigger value="help">Quick Help</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="issues" className="h-full m-0">
            <div className="h-full flex flex-col p-6">
              <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
                {/* Filters */}
                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search issues..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Issues List */}
                <div className="flex-1 overflow-y-auto space-y-4">
                  {filteredIssues.map((issue) => (
                    <Card key={issue.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getCategoryIcon(issue.category)}
                              <CardTitle className="text-lg">{issue.title}</CardTitle>
                            </div>
                            <CardDescription className="line-clamp-2">
                              {issue.description}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col gap-2 items-end">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(issue.status)}
                              <span className="text-sm capitalize">{issue.status.replace('-', ' ')}</span>
                            </div>
                            <Badge className={getPriorityColor(issue.priority)}>
                              {issue.priority}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Created {issue.createdAt.toLocaleDateString()}</span>
                            {issue.files && (
                              <div className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                <span>{issue.files.length} files</span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Ask Hannah
                            </Button>
                          </div>
                        </div>
                        {issue.solution && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">Solution</span>
                            </div>
                            <p className="text-sm text-green-700">{issue.solution}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  {filteredIssues.length === 0 && (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
                      <p className="text-gray-500">Create your first issue or adjust your filters</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="create" className="h-full m-0">
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Issue</CardTitle>
                    <CardDescription>
                      Describe your problem or question and Hannah will help you solve it
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Issue Title</label>
                      <Input
                        placeholder="Brief description of your issue..."
                        value={newIssue.title}
                        onChange={(e) => setNewIssue(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Detailed Description</label>
                      <Textarea
                        placeholder="Provide as much detail as possible about your issue, including error messages, what you've tried, and what you expected to happen..."
                        className="min-h-32"
                        value={newIssue.description}
                        onChange={(e) => setNewIssue(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Category</label>
                        <Select value={newIssue.category} onValueChange={(value: any) => setNewIssue(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bug">🐛 Bug</SelectItem>
                            <SelectItem value="question">❓ Question</SelectItem>
                            <SelectItem value="help">🆘 Help</SelectItem>
                            <SelectItem value="feature">💡 Feature</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Priority</label>
                        <Select value={newIssue.priority} onValueChange={(value: any) => setNewIssue(prev => ({ ...prev, priority: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">🟢 Low</SelectItem>
                            <SelectItem value="medium">🟡 Medium</SelectItem>
                            <SelectItem value="high">🔴 High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Upload Files (Optional)</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Drop your files here or <span className="text-blue-600">browse</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Supported: .js, .py, .java, .cpp, .txt, .log (Max 10MB)
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        onClick={handleCreateIssue}
                        disabled={!newIssue.title.trim() || !newIssue.description.trim()}
                        className="flex-1"
                      >
                        Create Issue
                      </Button>
                      <Button variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Ask Hannah Directly
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="help" className="h-full m-0">
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Quick Help Cards */}
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="text-center">
                      <Bug className="h-12 w-12 text-red-500 mx-auto mb-2" />
                      <CardTitle>Debug My Code</CardTitle>
                      <CardDescription>
                        Get help finding and fixing bugs in your code
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="text-center">
                      <Code className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                      <CardTitle>Code Review</CardTitle>
                      <CardDescription>
                        Get feedback on your code quality and best practices
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="text-center">
                      <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                      <CardTitle>Implementation Ideas</CardTitle>
                      <CardDescription>
                        Get suggestions for implementing features
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
