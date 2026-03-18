
CREATE TABLE public.app_config (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view config" ON public.app_config FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can update config" ON public.app_config FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert config" ON public.app_config FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.app_config (key, value) VALUES ('webhook_password', '1234');
