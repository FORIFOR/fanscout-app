import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { ScoutingReport, ScoutingFormData } from '@/types';

export function useReports(userId?: number) {
  const queryKey = userId 
    ? ['/api/scouting-reports', { userId }]
    : ['/api/scouting-reports'];

  const { 
    data: reports = [], 
    isLoading, 
    error 
  } = useQuery<ScoutingReport[]>({
    queryKey,
  });

  return {
    reports,
    isLoading,
    error
  };
}

export function useReport(id: number | null) {
  const { 
    data: report, 
    isLoading, 
    error 
  } = useQuery<ScoutingReport>({
    queryKey: ['/api/scouting-reports', id],
    enabled: id !== null,
  });

  return {
    report,
    isLoading,
    error
  };
}

export function useCreateReport() {
  const mutation = useMutation({
    mutationFn: async (data: Partial<ScoutingFormData> & { matchId: number, userId: number }) => {
      const response = await apiRequest('POST', '/api/scouting-reports', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scouting-reports'] });
    },
  });

  return mutation;
}

export function useUploadReportPhoto() {
  const mutation = useMutation({
    mutationFn: async ({ reportId, photoFile }: { reportId: number, photoFile: File }) => {
      const formData = new FormData();
      formData.append('photo', photoFile);
      
      const response = await apiRequest('POST', `/api/scouting-reports/${reportId}/photo`, formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scouting-reports'] });
    },
  });

  return mutation;
}

export function useLikeReport() {
  const mutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('POST', `/api/scouting-reports/${id}/like`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scouting-reports'] });
    },
  });

  return mutation;
}
