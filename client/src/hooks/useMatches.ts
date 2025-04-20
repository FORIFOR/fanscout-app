import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Match } from '@/types';

export function useMatches() {
  const { 
    data: matches = [], 
    isLoading, 
    error 
  } = useQuery<Match[]>({
    queryKey: ['/api/matches'],
  });

  return {
    matches,
    isLoading,
    error
  };
}

export function useMatch(id: number | null) {
  const { 
    data: match, 
    isLoading, 
    error 
  } = useQuery<Match>({
    queryKey: ['/api/matches', id],
    enabled: id !== null,
  });

  return {
    match,
    isLoading,
    error
  };
}
