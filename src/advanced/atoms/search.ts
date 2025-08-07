import { atom } from 'jotai';

export const searchTermAtom = atom('');

export const debouncedSearchTermAtom = atom((get) => {
  const searchTerm = get(searchTermAtom);
  return searchTerm;
});