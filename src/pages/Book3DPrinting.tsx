import { Printer } from "lucide-react";
import BookingForm from "@/components/BookingForm";

const Book3DPrinting = () => (
  <BookingForm serviceName="3D Printing" icon={Printer} nominalFee={150} cmritFee={50} />
);

export default Book3DPrinting;
