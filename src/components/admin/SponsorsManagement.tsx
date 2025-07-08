import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Building, 
  Edit, 
  Trash2, 
  Plus, 
  Upload, 
  ExternalLink, 
  Eye, 
  EyeOff,
  X,
  MoveUp,
  MoveDown
} from 'lucide-react';
import { 
  useSponsorsManagement, 
  useCreateSponsor, 
  useUpdateSponsor, 
  useDeleteSponsor, 
  useUploadSponsorLogo,
  SponsorManagement 
} from '@/hooks/useSponsorsManagement';
import { useToast } from '@/hooks/use-toast';

const SponsorsManagement = () => {
  const { data: sponsors, isLoading, error } = useSponsorsManagement();
  const createSponsor = useCreateSponsor();
  const updateSponsor = useUpdateSponsor();
  const deleteSponsor = useDeleteSponsor();
  const uploadLogo = useUploadSponsorLogo();
  const { toast } = useToast();

  const [editingSponsor, setEditingSponsor] = useState<SponsorManagement | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    company_name: '',
    description: '',
    website_url: '',
    display_order: 0,
    is_active: true,
    payment_status: 'pending'
  });

  const resetForm = () => {
    setFormData({
      company_name: '',
      description: '',
      website_url: '',
      display_order: 0,
      is_active: true,
      payment_status: 'pending'
    });
    setLogoFile(null);
    setLogoPreview(null);
    setEditingSponsor(null);
  };

  const handleEdit = (sponsor: SponsorManagement) => {
    setEditingSponsor(sponsor);
    setFormData({
      company_name: sponsor.company_name,
      description: sponsor.description || '',
      website_url: sponsor.website_url || '',
      display_order: sponsor.display_order,
      is_active: sponsor.is_active,
      payment_status: sponsor.payment_status
    });
    setLogoPreview(sponsor.logo_url);
    setIsEditDialogOpen(true);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select a logo file smaller than 5MB.',
          variant: 'destructive',
        });
        return;
      }
      
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let logoUrl = logoPreview;
      
      if (logoFile) {
        const sponsorId = editingSponsor?.id || 'temp';
        logoUrl = await uploadLogo.mutateAsync({ file: logoFile, sponsorId });
      }

      const sponsorData = {
        ...formData,
        logo_url: logoUrl || null,
      };

      if (editingSponsor) {
        await updateSponsor.mutateAsync({
          id: editingSponsor.id,
          updates: sponsorData
        });
        toast({
          title: 'Sponsor Updated',
          description: 'Sponsor information has been updated successfully.',
        });
        setIsEditDialogOpen(false);
      } else {
        await createSponsor.mutateAsync(sponsorData);
        toast({
          title: 'Sponsor Created',
          description: 'New sponsor has been created successfully.',
        });
        setIsCreateDialogOpen(false);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving sponsor:', error);
      toast({
        title: 'Error',
        description: 'Failed to save sponsor. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string, companyName: string) => {
    if (window.confirm(`Are you sure you want to delete ${companyName}? This action cannot be undone.`)) {
      try {
        await deleteSponsor.mutateAsync(id);
        toast({
          title: 'Sponsor Deleted',
          description: `${companyName} has been deleted successfully.`,
        });
      } catch (error) {
        console.error('Error deleting sponsor:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete sponsor. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleToggleActive = async (sponsor: SponsorManagement) => {
    try {
      await updateSponsor.mutateAsync({
        id: sponsor.id,
        updates: { is_active: !sponsor.is_active }
      });
      toast({
        title: sponsor.is_active ? 'Sponsor Deactivated' : 'Sponsor Activated',
        description: `${sponsor.company_name} is now ${sponsor.is_active ? 'inactive' : 'active'}.`,
      });
    } catch (error) {
      console.error('Error toggling sponsor status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update sponsor status.',
        variant: 'destructive',
      });
    }
  };

  const handlePaymentStatusChange = async (sponsor: SponsorManagement, newStatus: string) => {
    try {
      await updateSponsor.mutateAsync({
        id: sponsor.id,
        updates: { payment_status: newStatus }
      });
      toast({
        title: 'Payment Status Updated',
        description: `${sponsor.company_name} payment status updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update payment status.',
        variant: 'destructive',
      });
    }
  };

  const moveDisplayOrder = async (sponsor: SponsorManagement, direction: 'up' | 'down') => {
    const currentOrder = sponsor.display_order;
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    
    try {
      await updateSponsor.mutateAsync({
        id: sponsor.id,
        updates: { display_order: newOrder }
      });
    } catch (error) {
      console.error('Error updating display order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update display order.',
        variant: 'destructive',
      });
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const LogoUploadSection = () => (
    <div className="space-y-2">
      <Label htmlFor="logo-upload">Company Logo</Label>
      <div className="space-y-4">
        {logoPreview ? (
          <div className="relative inline-block">
            <img 
              src={logoPreview} 
              alt="Logo preview" 
              className="h-20 w-auto max-w-[200px] object-contain border border-gray-200 rounded-md p-2"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={removeLogo}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <div className="text-sm text-gray-600 mb-2">
              Click to upload or replace logo
            </div>
            <Input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="w-full"
            />
          </div>
        )}
        <p className="text-xs text-gray-500">
          Upload company logo (max 5MB). Supports JPG, PNG, and other image formats.
        </p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-brand-navy/70">Loading sponsors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading sponsors</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand-navy">Sponsor Management</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-trans-blue hover:bg-trans-blue/90 text-brand-navy">
              <Plus className="w-4 h-4 mr-2" />
              Add Sponsor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Sponsor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website_url">Website URL</Label>
                  <Input
                    id="website_url"
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the sponsor..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Active Status</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                    <span className="text-sm">{formData.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Payment Status</Label>
                  <select
                    value={formData.payment_status}
                    onChange={(e) => setFormData(prev => ({ ...prev, payment_status: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <LogoUploadSection />

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createSponsor.isPending}>
                  {createSponsor.isPending ? 'Creating...' : 'Create Sponsor'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {sponsors && sponsors.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsors.map((sponsor) => (
                  <TableRow key={sponsor.id}>
                    <TableCell>
                      {sponsor.logo_url ? (
                        <img 
                          src={sponsor.logo_url} 
                          alt={`${sponsor.company_name} logo`}
                          className="h-10 w-auto max-w-[60px] object-contain"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                          <Building className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{sponsor.company_name}</div>
                        {sponsor.website_url && (
                          <a 
                            href={sponsor.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-trans-blue hover:text-trans-pink inline-flex items-center"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Website
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant={sponsor.is_active ? "default" : "secondary"}>
                          {sponsor.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(sponsor)}
                          className="h-6 w-6 p-0"
                        >
                          {sponsor.is_active ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <select
                        value={sponsor.payment_status}
                        onChange={(e) => handlePaymentStatusChange(sponsor, e.target.value)}
                        className={`px-2 py-1 rounded text-xs border ${getPaymentStatusColor(sponsor.payment_status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm">{sponsor.display_order}</span>
                        <div className="flex flex-col">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveDisplayOrder(sponsor, 'up')}
                            className="h-4 w-4 p-0"
                            disabled={sponsor.display_order <= 1}
                          >
                            <MoveUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveDisplayOrder(sponsor, 'down')}
                            className="h-4 w-4 p-0"
                          >
                            <MoveDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(sponsor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(sponsor.id, sponsor.company_name)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
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
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-brand-navy/30 mb-4" />
          <h3 className="text-lg font-medium text-brand-navy mb-2">No Sponsors Yet</h3>
          <p className="text-brand-navy/70">Create your first sponsor entry to get started.</p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Sponsor</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_company_name">Company Name *</Label>
                <Input
                  id="edit_company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_website_url">Website URL</Label>
                <Input
                  id="edit_website_url"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_description">Description</Label>
              <Textarea
                id="edit_description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the sponsor..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_display_order">Display Order</Label>
                <Input
                  id="edit_display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Active Status</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <span className="text-sm">{formData.is_active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Payment Status</Label>
                <select
                  value={formData.payment_status}
                  onChange={(e) => setFormData(prev => ({ ...prev, payment_status: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>

            <LogoUploadSection />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateSponsor.isPending}>
                {updateSponsor.isPending ? 'Updating...' : 'Update Sponsor'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SponsorsManagement;