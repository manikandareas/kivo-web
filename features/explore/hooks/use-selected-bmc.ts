import { parseAsString, useQueryState } from 'nuqs';

export function useSelectedBmc() {
  const [selectedBmcId, setSelectedBmcId] = useQueryState(
    'bmc',
    parseAsString.withDefault('')
  );

  return {
    selectedBmcId,
    setSelectedBmcId,
    clearSelection: () => setSelectedBmcId(null),
  };
}
