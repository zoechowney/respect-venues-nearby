-- Fix security vulnerability in venue_pending_changes table RLS policies
-- The "Admins can view all pending changes" policy currently allows ANY authenticated user
-- to access all pending changes, which exposes sensitive contact information

-- Drop the overly permissive admin policy
DROP POLICY IF EXISTS "Admins can view all pending changes" ON public.venue_pending_changes;

-- Create proper admin policies with correct role checking
-- Admins can view all pending changes (with proper admin role check)
CREATE POLICY "Admins can view all pending changes" 
ON public.venue_pending_changes 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Admins can update pending changes (with proper admin role check)
CREATE POLICY "Admins can update pending changes" 
ON public.venue_pending_changes 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Admins can delete pending changes (with proper admin role check)
CREATE POLICY "Admins can delete pending changes" 
ON public.venue_pending_changes 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);