import { ScanLine } from "lucide-react";
import BookingForm from "@/components/BookingForm";

const BookLaserPrinting = () => (
  <BookingForm serviceName="Laser Printing" icon={ScanLine} nominalFee={100} cmritFee={30} />
);

export default BookLaserPrinting;
