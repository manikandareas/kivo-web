/**
 * Generates a DiceBear profile image URL using the open-peeps style.
 * @param name - The user's name to use as seed for the avatar
 * @returns A valid DiceBear API URL with the encoded name as seed
 */
export function generateProfileImage(name: string): string {
  return `https://api.dicebear.com/9.x/open-peeps/svg?seed=${encodeURIComponent(
    name
  )}`;
}
