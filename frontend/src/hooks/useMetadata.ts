import { useMemo } from 'react';
import { useApi } from './useApi';
import type { MetadataResponse } from '../types';

const metadataUrl = '/api/metadata/';

export function useMetadata() {
  const { data, loading, error, refetch } = useApi<MetadataResponse>(metadataUrl);

  const value = useMemo(() => {
    if (!data) {
      const emptyChoices: MetadataResponse['tank_choices'] = {
        facility_type: [],
        foundation: [],
        access_structure: [],
        comment_types: [],
        visual_areas: [],
        ut_categories: []
      };
      return {
        methods: [],
        goals: [],
        tank_choices: emptyChoices,
        choices: emptyChoices
      } as MetadataResponse & { choices: MetadataResponse['tank_choices'] };
    }
    return { ...data, choices: data.tank_choices } as MetadataResponse & { choices: MetadataResponse['tank_choices'] };
  }, [data]);

  return { metadata: value, loading, error, refetch } as const;
}
