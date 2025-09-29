import { useMemo } from 'react';
import { useApi } from './useApi';
const metadataUrl = '/api/metadata/';
export function useMetadata() {
    const { data, loading, error, refetch } = useApi(metadataUrl);
    const value = useMemo(() => {
        if (!data) {
            const emptyChoices = {
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
            };
        }
        return { ...data, choices: data.tank_choices };
    }, [data]);
    return { metadata: value, loading, error, refetch };
}
