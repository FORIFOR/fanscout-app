import { useQuery } from '@tanstack/react-query';
import { Club } from '@/types';

export function useClubs() {
  const { 
    data: clubs = [], 
    isLoading, 
    error 
  } = useQuery<Club[]>({
    queryKey: ['/api/clubs'],
  });

  return {
    clubs,
    isLoading,
    error
  };
}

export function useClub(id: number | null) {
  const { 
    data: club, 
    isLoading, 
    error 
  } = useQuery<Club>({
    queryKey: ['/api/clubs', id],
    enabled: id !== null,
  });

  return {
    club,
    isLoading,
    error
  };
}
