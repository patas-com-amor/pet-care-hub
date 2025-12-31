// Department types
export type DepartmentId = 'estetica' | 'saude' | 'educacao' | 'estadia' | 'logistica';

export interface Department {
  id: DepartmentId;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  services: Service[];
}

export interface Service {
  id: string;
  name: string;
  departmentId: DepartmentId;
  duration: number; // in minutes
  price: number;
  commissionPercentage?: number;
}

// Pet and Owner types
export interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'other';
  breed: string;
  size: 'small' | 'medium' | 'large' | 'giant';
  birthDate: string;
  ownerId: string;
  photoUrl?: string;
  allergies: string[];
  behaviors: PetBehavior[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface PetBehavior {
  type: 'bites' | 'fears_dryer' | 'aggressive' | 'anxious' | 'calm' | 'friendly';
  notes?: string;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  cpf: string;
  pets: string[]; // Pet IDs
  createdAt: string;
  updatedAt: string;
}

// Appointment types
export interface Appointment {
  id: string;
  petId: string;
  ownerId: string;
  departmentId: DepartmentId;
  serviceId: string;
  employeeId?: string;
  scheduledAt: string;
  status: AppointmentStatus;
  checkInAt?: string;
  checkOutAt?: string;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  notes?: string;
  packageId?: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled';

// Employee types
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  departments: DepartmentId[];
  commissionEnabled: boolean;
  commissionPercentage: number;
  photoUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EmployeeRole = 'admin' | 'manager' | 'groomer' | 'veterinarian' | 'trainer' | 'receptionist' | 'driver';

// Service Package types
export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  serviceId: string;
  quantity: number;
  validityDays: number;
  originalPrice: number;
  discountedPrice: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerPackage {
  id: string;
  packageId: string;
  ownerId: string;
  petId: string;
  remainingUses: number;
  purchasedAt: string;
  expiresAt: string;
  usedAppointments: string[];
}

// Financial types
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: 'service' | 'product' | 'package' | 'commission' | 'other';
  description: string;
  amount: number;
  appointmentId?: string;
  employeeId?: string;
  date: string;
  createdAt: string;
}

// Settings type
export interface AppSettings {
  departments: Record<DepartmentId, boolean>;
  businessName: string;
  businessPhone: string;
  businessAddress: string;
  n8nWebhookUrl: string;
}
