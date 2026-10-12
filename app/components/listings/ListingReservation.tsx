'use client';

import { Range } from 'react-date-range';
import Calendar from '../inputs/Calendar';
import Button from '../Button';

type ListingReservationProps = {
  price: number;
  dateRange: Range;
  totalPrice: number;
  onChangeDate: (value: Range) => void;
  onSubmit: () => void;
  disabled?: boolean;
  disabledDates: Date[]
}

export default function ListingReservation({
  price,
  dateRange,
  totalPrice,
  onChangeDate,
  onSubmit,
  disabled,
  disabledDates
}: ListingReservationProps) {
  const hasValidDateRange =
    dateRange.startDate instanceof Date &&
    dateRange.endDate instanceof Date &&
    dateRange.endDate > dateRange.startDate;

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">₱ {price}</div>
        <div className="font-light text-neutral-600">night</div>
      </div>
      <hr className="border-neutral-200" />
      <Calendar
        value={dateRange}
        disabledDates={disabledDates}
        onChange={(value) => {
          if (value.selection) {
            onChangeDate(value.selection);
          }
        }}
      />
      <hr className="border-neutral-200" />
      <div className="p-4">
        <Button
          label="Reserve"
          onClick={() => onSubmit()}
          disabled={disabled || !hasValidDateRange}
        />
      </div>
      <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
        <div>Total</div>
        <div>₱ {totalPrice}</div>
      </div>
    </div>
  );
}