-- Insert initial services for each department
INSERT INTO public.services (name, department_id, duration, price, commission_percentage, active) VALUES
-- Estética
('Banho Simples', 'estetica', 60, 50.00, 10, true),
('Banho e Tosa Higiênica', 'estetica', 90, 80.00, 15, true),
('Banho e Tosa Completa', 'estetica', 120, 120.00, 15, true),
('Tosa na Máquina', 'estetica', 60, 70.00, 12, true),
('Tosa na Tesoura', 'estetica', 90, 100.00, 15, true),
('Hidratação', 'estetica', 30, 40.00, 10, true),

-- Saúde
('Consulta Veterinária', 'saude', 30, 150.00, 20, true),
('Vacinação', 'saude', 15, 80.00, 10, true),
('Vermifugação', 'saude', 15, 50.00, 10, true),
('Exame de Sangue', 'saude', 20, 120.00, 15, true),
('Ultrassonografia', 'saude', 40, 200.00, 20, true),

-- Educação
('Adestramento Básico', 'educacao', 60, 100.00, 15, true),
('Adestramento Avançado', 'educacao', 90, 150.00, 20, true),
('Socialização', 'educacao', 60, 80.00, 10, true),
('Passeio Educativo', 'educacao', 45, 60.00, 10, true),

-- Estadia
('Day Care', 'estadia', 480, 80.00, 10, true),
('Hotel - Diária', 'estadia', 1440, 120.00, 15, true),
('Hotel - Pacote Semanal', 'estadia', 10080, 700.00, 20, true),

-- Logística
('Leva e Traz', 'logistica', 60, 40.00, 15, true),
('Transporte Veterinário', 'logistica', 90, 80.00, 20, true),
('Entrega de Medicamentos', 'logistica', 30, 25.00, 10, true)
ON CONFLICT DO NOTHING;