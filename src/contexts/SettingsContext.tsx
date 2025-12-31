import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppSettings, DepartmentId } from '@/types';

const defaultSettings: AppSettings = {
  departments: {
    estetica: true,
    saude: true,
    educacao: true,
    estadia: true,
    logistica: true,
  },
  businessName: 'PetShop Manager',
  businessPhone: '',
  businessAddress: '',
  n8nWebhookUrl: 'https://n8n-n8n-start.yh11mi.easypanel.host/fluxo',
};

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  toggleDepartment: (departmentId: DepartmentId) => void;
  isDepartmentEnabled: (departmentId: DepartmentId) => boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('petshop-settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('petshop-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleDepartment = (departmentId: DepartmentId) => {
    setSettings(prev => ({
      ...prev,
      departments: {
        ...prev.departments,
        [departmentId]: !prev.departments[departmentId],
      },
    }));
  };

  const isDepartmentEnabled = (departmentId: DepartmentId) => {
    return settings.departments[departmentId] ?? false;
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, toggleDepartment, isDepartmentEnabled }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
