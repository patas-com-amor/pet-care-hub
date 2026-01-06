import { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Owner {
  id: string;
  name: string;
  phone?: string | null;
  whatsapp?: string | null;
  cpf?: string | null;
}

interface OwnerSearchSelectProps {
  owners: Owner[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function OwnerSearchSelect({
  owners,
  value,
  onValueChange,
  placeholder = 'Buscar tutor...',
  disabled = false,
}: OwnerSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOwner = owners.find((owner) => owner.id === value);

  const filteredOwners = useMemo(() => {
    if (!searchQuery) return owners;
    
    const queryText = searchQuery.toLowerCase().trim();
    const queryNumbers = searchQuery.replace(/\D/g, '');
    
    return owners.filter((owner) => {
      // Match by name
      if (owner.name.toLowerCase().includes(queryText)) return true;
      
      // Only check numeric fields if there are digits in the search
      if (queryNumbers.length > 0) {
        // Match by WhatsApp (numbers only)
        if (owner.whatsapp) {
          const whatsappNumbers = owner.whatsapp.replace(/\D/g, '');
          if (whatsappNumbers.includes(queryNumbers)) return true;
        }
        
        // Match by phone (numbers only)
        if (owner.phone) {
          const phoneNumbers = owner.phone.replace(/\D/g, '');
          if (phoneNumbers.includes(queryNumbers)) return true;
        }
        
        // Match by CPF (numbers only)
        if (owner.cpf) {
          const cpfNumbers = owner.cpf.replace(/\D/g, '');
          if (cpfNumbers.includes(queryNumbers)) return true;
        }
      }
      
      return false;
    });
  }, [owners, searchQuery]);

  const formatDisplay = (owner: Owner) => {
    const parts = [owner.name];
    if (owner.whatsapp) parts.push(owner.whatsapp);
    else if (owner.phone) parts.push(owner.phone);
    return parts.join(' • ');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
          disabled={disabled}
        >
          {selectedOwner ? (
            <span className="truncate">{selectedOwner.name}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Buscar por nome, WhatsApp ou CPF..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>Nenhum tutor encontrado.</CommandEmpty>
            <CommandGroup>
              {filteredOwners.map((owner) => (
                <CommandItem
                  key={owner.id}
                  value={owner.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === owner.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{owner.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {owner.whatsapp || owner.phone || 'Sem telefone'}
                      {owner.cpf && ` • CPF: ${owner.cpf}`}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
