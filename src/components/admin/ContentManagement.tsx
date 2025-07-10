import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  History, 
  Save, 
  Settings,
  Copy,
  ExternalLink
} from 'lucide-react';
import { 
  useContentPages, 
  useCreateContentPage, 
  useUpdateContentPage, 
  useDeleteContentPage,
  useContentRevisions,
  useSiteSettings,
  useUpdateSiteSetting,
  ContentPage,
  SiteSetting
} from '@/hooks/useContentManagement';
import { formatDistanceToNow } from 'date-fns';

const ContentManagement = () => {
  const { data: contentPages, isLoading: pagesLoading } = useContentPages();
  const { data: siteSettings, isLoading: settingsLoading } = useSiteSettings();
  const [editingPage, setEditingPage] = useState<ContentPage | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [revisionsDialogOpen, setRevisionsDialogOpen] = useState<string | null>(null);

  const createPage = useCreateContentPage();
  const updatePage = useUpdateContentPage();
  const deletePage = useDeleteContentPage();
  const updateSetting = useUpdateSiteSetting();

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    content: '',
    excerpt: '',
    category: 'page' as ContentPage['category'],
    status: 'draft' as ContentPage['status'],
    meta_title: '',
    meta_description: '',
  });

  const resetForm = () => {
    setFormData({
      slug: '',
      title: '',
      content: '',
      excerpt: '',
      category: 'page',
      status: 'draft',
      meta_title: '',
      meta_description: '',
    });
    setEditingPage(null);
  };

  const handleEdit = (page: ContentPage) => {
    setEditingPage(page);
    setFormData({
      slug: page.slug,
      title: page.title,
      content: page.content,
      excerpt: page.excerpt || '',
      category: page.category,
      status: page.status,
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const pageData = {
        ...formData,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
      };

      if (editingPage) {
        await updatePage.mutateAsync({
          id: editingPage.id,
          updates: pageData
        });
        setIsEditDialogOpen(false);
      } else {
        await createPage.mutateAsync(pageData);
        setIsCreateDialogOpen(false);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        await deletePage.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting page:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'policy':
        return 'bg-blue-100 text-blue-800';
      case 'resource':
        return 'bg-purple-100 text-purple-800';
      case 'homepage':
        return 'bg-pink-100 text-pink-800';
      case 'announcement':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const ContentForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
            disabled={createPage.isPending || updatePage.isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
            placeholder="url-friendly-slug"
            required
            disabled={createPage.isPending || updatePage.isPending}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as ContentPage['category'] }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="page">Page</SelectItem>
              <SelectItem value="policy">Policy</SelectItem>
              <SelectItem value="resource">Resource</SelectItem>
              <SelectItem value="announcement">Announcement</SelectItem>
              <SelectItem value="footer">Footer</SelectItem>
              <SelectItem value="homepage">Homepage</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as ContentPage['status'] }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
          placeholder="Brief description or summary"
          rows={2}
          disabled={createPage.isPending || updatePage.isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Enter your content here..."
          rows={12}
          className="font-mono text-sm"
          required
          disabled={createPage.isPending || updatePage.isPending}
        />
        <p className="text-xs text-gray-500">Supports HTML and Markdown formatting</p>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-4">SEO Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input
              id="meta_title"
              value={formData.meta_title}
              onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
              placeholder="SEO title"
              disabled={createPage.isPending || updatePage.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea
              id="meta_description"
              value={formData.meta_description}
              onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
              placeholder="SEO description"
              rows={2}
              disabled={createPage.isPending || updatePage.isPending}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            if (editingPage) {
              setIsEditDialogOpen(false);
            } else {
              setIsCreateDialogOpen(false);
            }
            resetForm();
          }}
          disabled={createPage.isPending || updatePage.isPending}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={createPage.isPending || updatePage.isPending}
        >
          <Save className="w-4 h-4 mr-2" />
          {createPage.isPending || updatePage.isPending ? 'Saving...' : editingPage ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );

  if (pagesLoading || settingsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-brand-navy/70">Loading content management...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand-navy">Content Management</h2>
      </div>

      <Tabs defaultValue="pages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pages">Content Pages</TabsTrigger>
          <TabsTrigger value="settings">Site Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-brand-navy">Content Pages</h3>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-trans-blue hover:bg-trans-blue/90 text-brand-navy">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Page
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Content Page</DialogTitle>
                </DialogHeader>
                <ContentForm />
              </DialogContent>
            </Dialog>
          </div>

          {contentPages && contentPages.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contentPages.map((page) => (
                      <TableRow key={page.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{page.title}</div>
                            {page.excerpt && (
                              <div className="text-sm text-gray-500 mt-1">{page.excerpt}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            /{page.slug}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor(page.category)}>
                            {page.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(page.status)}>
                            {page.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(page.updated_at), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(page)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setRevisionsDialogOpen(page.id)}
                            >
                              <History className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(page.id, page.title)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No content pages yet</h3>
                <p className="text-gray-500">Create your first content page to get started.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-brand-navy">Site Settings</h3>
          </div>

          {siteSettings && (
            <div className="grid gap-6">
              {Object.entries(
                siteSettings.reduce((acc, setting) => {
                  acc[setting.category] = acc[setting.category] || [];
                  acc[setting.category].push(setting);
                  return acc;
                }, {} as Record<string, SiteSetting[]>)
              ).map(([category, settings]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="capitalize">{category} Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {settings.map((setting) => (
                      <div key={setting.id} className="grid grid-cols-3 gap-4 items-center">
                        <div>
                          <Label className="font-medium">{setting.key.replace(/_/g, ' ')}</Label>
                          {setting.description && (
                            <p className="text-sm text-gray-500">{setting.description}</p>
                          )}
                        </div>
                        <div>
                          <Input
                            value={setting.value}
                            onChange={(e) => {
                              updateSetting.mutate({
                                key: setting.key,
                                value: e.target.value
                              });
                            }}
                            disabled={updateSetting.isPending}
                          />
                        </div>
                        <div className="text-sm text-gray-500">
                          Updated {formatDistanceToNow(new Date(setting.updated_at), { addSuffix: true })}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Content Page</DialogTitle>
          </DialogHeader>
          <ContentForm />
        </DialogContent>
      </Dialog>

      {/* Revisions Dialog */}
      {revisionsDialogOpen && (
        <RevisionsDialog 
          contentPageId={revisionsDialogOpen} 
          isOpen={!!revisionsDialogOpen}
          onClose={() => setRevisionsDialogOpen(null)}
        />
      )}
    </div>
  );
};

interface RevisionsDialogProps {
  contentPageId: string;
  isOpen: boolean;
  onClose: () => void;
}

const RevisionsDialog: React.FC<RevisionsDialogProps> = ({ contentPageId, isOpen, onClose }) => {
  const { data: revisions, isLoading } = useContentRevisions(contentPageId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Content Revisions</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="text-center py-8">Loading revisions...</div>
        ) : revisions && revisions.length > 0 ? (
          <div className="space-y-4">
            {revisions.map((revision) => (
              <Card key={revision.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Revision #{revision.revision_number}</h4>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(revision.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <strong>Title:</strong> {revision.title}
                    </div>
                    {revision.excerpt && (
                      <div>
                        <strong>Excerpt:</strong> {revision.excerpt}
                      </div>
                    )}
                    <div>
                      <strong>Content Preview:</strong>
                      <div className="bg-gray-50 p-3 mt-1 rounded text-sm max-h-32 overflow-y-auto">
                        {revision.content.substring(0, 200)}...
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No revisions found</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContentManagement;