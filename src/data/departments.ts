import { Department, Service } from '@/types';

export const departments: Department[] = [
  {
    id: 'estetica',
    name: 'Estética',
    description: 'Banho, tosa e hidratação para deixar seu pet lindo',
    icon: 'Sparkles',
    enabled: true,
    services: [
      { id: 'banho', name: 'Banho', departmentId: 'estetica', duration: 60, price: 50, commissionPercentage: 10 },
      { id: 'tosa', name: 'Tosa', departmentId: 'estetica', duration: 90, price: 80, commissionPercentage: 15 },
      { id: 'banho-tosa', name: 'Banho + Tosa', departmentId: 'estetica', duration: 120, price: 120, commissionPercentage: 15 },
      { id: 'hidratacao', name: 'Hidratação', departmentId: 'estetica', duration: 30, price: 40, commissionPercentage: 10 },
    ],
  },
  {
    id: 'saude',
    name: 'Saúde',
    description: 'Consultas, vacinas e exames veterinários',
    icon: 'Heart',
    enabled: true,
    services: [
      { id: 'consulta', name: 'Consulta Veterinária', departmentId: 'saude', duration: 30, price: 150 },
      { id: 'vacina', name: 'Aplicação de Vacina', departmentId: 'saude', duration: 15, price: 80 },
      { id: 'exame-sangue', name: 'Exame de Sangue', departmentId: 'saude', duration: 20, price: 120 },
      { id: 'exame-imagem', name: 'Exame de Imagem', departmentId: 'saude', duration: 45, price: 200 },
    ],
  },
  {
    id: 'educacao',
    name: 'Educação',
    description: 'Adestramento e consultoria comportamental',
    icon: 'GraduationCap',
    enabled: true,
    services: [
      { id: 'adestramento', name: 'Sessão de Adestramento', departmentId: 'educacao', duration: 60, price: 120 },
      { id: 'consultoria', name: 'Consultoria Comportamental', departmentId: 'educacao', duration: 90, price: 200 },
    ],
  },
  {
    id: 'estadia',
    name: 'Estadia',
    description: 'Daycare e hotel para seu pet',
    icon: 'Home',
    enabled: true,
    services: [
      { id: 'daycare', name: 'Daycare (Diária)', departmentId: 'estadia', duration: 480, price: 80 },
      { id: 'hotel', name: 'Hotel (Pernoite)', departmentId: 'estadia', duration: 1440, price: 120 },
    ],
  },
  {
    id: 'logistica',
    name: 'Logística',
    description: 'Serviço de leva e traz',
    icon: 'Truck',
    enabled: true,
    services: [
      { id: 'leva-traz', name: 'Leva e Traz', departmentId: 'logistica', duration: 60, price: 40 },
      { id: 'leva', name: 'Apenas Buscar', departmentId: 'logistica', duration: 30, price: 25 },
      { id: 'traz', name: 'Apenas Entregar', departmentId: 'logistica', duration: 30, price: 25 },
    ],
  },
];

export const getDepartmentById = (id: string): Department | undefined => {
  return departments.find(dept => dept.id === id);
};

export const getServiceById = (id: string): Service | undefined => {
  for (const dept of departments) {
    const service = dept.services.find(s => s.id === id);
    if (service) return service;
  }
  return undefined;
};

export const getServicesByDepartment = (departmentId: string): Service[] => {
  const dept = departments.find(d => d.id === departmentId);
  return dept?.services || [];
};
