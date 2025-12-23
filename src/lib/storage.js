import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure bookings file exists
if (!fs.existsSync(BOOKINGS_FILE)) {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([]));
}

export function getBookings() {
  try {
    const data = fs.readFileSync(BOOKINGS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading bookings:", error);
    return [];
  }
}

export function saveBookings(bookings) {
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
    return true;
  } catch (error) {
    console.error("Error saving bookings:", error);
    return false;
  }
}

export function getBookingsByUserId(userId) {
  const bookings = getBookings();
  return bookings.filter((b) => b.userId === userId);
}

export function addBooking(booking) {
  const bookings = getBookings();
  bookings.push(booking);
  return saveBookings(bookings);
}

export function updateBooking(bookingId, updates) {
  const bookings = getBookings();
  const index = bookings.findIndex((b) => b.id === bookingId);

  if (index === -1) return false;

  bookings[index] = { ...bookings[index], ...updates };
  return saveBookings(bookings);
}

export function deleteBooking(bookingId) {
  const bookings = getBookings();
  const filtered = bookings.filter((b) => b.id !== bookingId);
  return saveBookings(filtered);
}
