-- Enable RLS on existing tables
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colaboradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicos_oferecidos ENABLE ROW LEVEL SECURITY;

-- Policies for agendamentos (authenticated users can read, admins can do everything)
CREATE POLICY "Authenticated users can view agendamentos"
ON public.agendamentos
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert agendamentos"
ON public.agendamentos
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update agendamentos"
ON public.agendamentos
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Admins can delete agendamentos"
ON public.agendamentos
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policies for colaboradores
CREATE POLICY "Authenticated users can view colaboradores"
ON public.colaboradores
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can insert colaboradores"
ON public.colaboradores
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update colaboradores"
ON public.colaboradores
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete colaboradores"
ON public.colaboradores
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policies for servicos_oferecidos
CREATE POLICY "Authenticated users can view servicos"
ON public.servicos_oferecidos
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can insert servicos"
ON public.servicos_oferecidos
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update servicos"
ON public.servicos_oferecidos
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete servicos"
ON public.servicos_oferecidos
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));