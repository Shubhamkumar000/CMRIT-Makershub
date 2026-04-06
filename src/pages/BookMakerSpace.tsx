import { BookOpen } from "lucide-react";
import BookingForm from "@/components/BookingForm";

const BookMakerSpace = () => (
  <BookingForm serviceName="Book MakerSpace" icon={BookOpen} nominalFee={200} cmritFee={75} />
);

export default BookMakerSpace;
