// Mock data for celestial event locations and comments

export const eventLocations: Record<number, string[]> = {
  1: ["Northern Hemisphere", "Europe", "North America"],
  2: ["Asia", "Australia"],
  3: ["Worldwide"],
  4: ["South America", "Africa"],
  5: ["Local Astronomy Club"],
  6: ["North America", "Europe"],
  7: ["Southern Hemisphere"],
  8: ["Worldwide"],
  9: ["Local Park"]
};

export const eventComments: Record<number, Array<{ id: number; user: string; rating: number; text: string }>> = {
  1: [
    { id: 1, user: "Alice", rating: 5, text: "Amazing meteor shower!" },
    { id: 2, user: "Bob", rating: 4, text: "Saw so many shooting stars." }
  ],
  2: [
    { id: 1, user: "Charlie", rating: 5, text: "Eclipse was breathtaking." }
  ],
  3: [],
  4: [],
  5: [
    { id: 1, user: "Diana", rating: 5, text: "Great meetup! Learned a lot." }
  ],
  6: [],
  7: [],
  8: [],
  9: []
};
