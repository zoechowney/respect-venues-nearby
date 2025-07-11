-- Create data rights requests table
CREATE TABLE public.data_rights_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('access', 'download', 'correct', 'delete', 'portability', 'restrict', 'object')),
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
  processed_by UUID,
  processed_at TIMESTAMP WITH TIME ZONE,
  response_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.data_rights_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for data rights requests
CREATE POLICY "Anyone can submit data rights requests" 
ON public.data_rights_requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all data rights requests" 
ON public.data_rights_requests 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can update data rights requests" 
ON public.data_rights_requests 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_data_rights_requests_updated_at
BEFORE UPDATE ON public.data_rights_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();